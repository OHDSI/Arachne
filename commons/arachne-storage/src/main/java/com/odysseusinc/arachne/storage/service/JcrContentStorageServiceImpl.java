package com.odysseusinc.arachne.storage.service;


import com.odysseusinc.arachne.commons.utils.CommonFileUtils;
import com.odysseusinc.arachne.storage.converter.JcrNodeToArachneFileMeta;
import com.odysseusinc.arachne.storage.model.ArachneFileMeta;
import com.odysseusinc.arachne.storage.model.ArachneFileMetaImpl;
import com.odysseusinc.arachne.storage.model.QuerySpec;
import com.odysseusinc.arachne.storage.util.FileSaveRequest;
import com.odysseusinc.arachne.storage.util.TypifiedJcrTemplate;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Table;
import org.apache.commons.lang3.NotImplementedException;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.api.JackrabbitRepository;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.core.fs.FileSystemPathUtil;
import org.apache.jackrabbit.util.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;

@Service
public class JcrContentStorageServiceImpl implements ContentStorageService {

    private static Logger log = LoggerFactory.getLogger(JcrContentStorageServiceImpl.class);

    // To ensure proper order of beans load
    @Autowired
    private JcrNodeToArachneFileMeta jcrNodeToArachneFileMeta;

    public static String ENTITY_FILES_DIR = "entities";

    public static String MIX_ARACHNE_FILE = "mix:arachneFile";

    public static String JCR_CONTENT_TYPE = "jcr:contentType";
    public static String JCR_AUTHOR = "jcr:author";

    protected JackrabbitRepository repository;
    protected TypifiedJcrTemplate jcrTemplate;
    protected ConversionService conversionService;
    protected EntityManagerFactory entityManagerFactory;

    @Autowired
    public JcrContentStorageServiceImpl(TypifiedJcrTemplate jcrTemplate,
                                        ConversionService conversionService,
                                        EntityManagerFactory entityManagerFactory) {

        this.jcrTemplate = jcrTemplate;
        this.conversionService = conversionService;
        this.entityManagerFactory = entityManagerFactory;
    }

    public String getLocationForEntity(String entityTableName, Serializable entityIdentifier, List<String> additionalPathParts) {

        List<String> pathParts = new ArrayList<>(Arrays.asList(ENTITY_FILES_DIR, entityTableName, entityIdentifier.toString()));

        if (additionalPathParts != null) {
            pathParts.addAll(additionalPathParts);
        }

        final String ESCAPED_PATH_SEPARATOR = Text.escapeIllegalJcrChars(PATH_SEPARATOR);
        
        return PATH_SEPARATOR + pathParts.stream()
                .filter(part -> StringUtils.isNotBlank(part) && !part.equals(PATH_SEPARATOR) && !ESCAPED_PATH_SEPARATOR.equals(part))
                .collect(Collectors.joining(PATH_SEPARATOR));
    }

    public String getLocationForEntity(Class domainClazz, Serializable entityId, List<String> additionalPathParts) {

        Table entityTable = (Table) domainClazz.getAnnotation(Table.class);
        return getLocationForEntity(entityTable.name(), entityId, additionalPathParts);
    }

    public String getLocationForEntity(Object domainObject, List<String> additionalPathParts) {

        String entityId = String.valueOf(entityManagerFactory.getPersistenceUnitUtil().getIdentifier(domainObject));
        return getLocationForEntity(domainObject.getClass(), entityId, additionalPathParts);
    }

    @Override
    public ArachneFileMeta getFileByPath(String absoulteFilename) {

        return jcrTemplate.exec(session -> {

            Node fileNode = session.getNode(absoulteFilename);
            return getFile(fileNode);
        });
    }

    @Override
    public ArachneFileMeta getFileByIdentifier(String identifier) {

        return jcrTemplate.exec(session -> {

            Node fileNode = session.getNodeByIdentifier(identifier);
            return getFile(fileNode);
        });
    }

    @Override
    public InputStream getContentByIdentifier(String identifier) {

        return jcrTemplate.exec(session -> {

            final Node fileNode = session.getNodeByIdentifier(identifier);
            return getInputStream(fileNode);
        });
    }

    private InputStream getInputStream(final Node fileNode) throws RepositoryException {

        InputStream stream = null;

        if (fileNode.hasNode(JcrConstants.JCR_CONTENT)) {
            final Node resNode = fileNode.getNode(JcrConstants.JCR_CONTENT);
            stream = resNode.getProperty(JcrConstants.JCR_DATA).getBinary().getStream();
        }

        return stream;
    }

    @Override
    public InputStream getContentByFilepath(String absoulteFilename) {

        return jcrTemplate.exec(session -> {

            final Node fileNode = session.getNode(fixPath(absoulteFilename));
            return getInputStream(fileNode);
        });
    }

    @Override
    public ArachneFileMeta saveFile(File file, String destinationPath, Long createdById) {

        FileSaveRequest saveRequest = new FileSaveRequest();
        saveRequest.setDestinationFilepath(destinationPath);
        saveRequest.setFile(file);

        return saveBatch(Arrays.asList(saveRequest), createdById).get(0);
    }

    @Override
    public List<ArachneFileMeta> saveBatch(List<FileSaveRequest> fileSaveRequestList, Long createdById) {

        return jcrTemplate.exec(session -> {

            List<ArachneFileMeta> savedFileList = new ArrayList<>();
            Map<String, Node> folderNodeCache = new HashMap<>();

            Integer doneCount = 0;
            Integer notPersistedCount = 0;

            for (FileSaveRequest request : fileSaveRequestList) {

                String fixedPath = replaceBackSlashes(request.getDestinationFilepath());
                String escapedPath = escapePath(fixedPath);
                
                String dirPath = FileSystemPathUtil.getParentDir(escapedPath);
                String filename = FileSystemPathUtil.getName(escapedPath);

                Node parentNode = folderNodeCache.get(dirPath);
                if (parentNode == null) {
                    parentNode = getOrAddNestedFolder(session, dirPath);
                    folderNodeCache.put(dirPath, parentNode);
                }

                Node node = saveFile(
                        parentNode,
                        filename,
                        request.getFile(),
                        createdById
                );

                ArachneFileMetaImpl meta = new ArachneFileMetaImpl();
                meta.setUuid(node.getIdentifier());
                meta.setPath(fixedPath);

                savedFileList.add(meta);

                doneCount++;
                notPersistedCount++;

                if (notPersistedCount >= 1000) {
                    session.save();
                    notPersistedCount = 0;
                    log.debug("Persisted {}/{} items", doneCount, fileSaveRequestList.size());
                }
            }

            session.save();

            return savedFileList;
        });
    }

    @Override
    public List<ArachneFileMeta> searchFiles(QuerySpec querySpec) {

        return jcrTemplate.exec(session -> {

            long time = System.nanoTime();

            List<ArachneFileMeta> result = new ArrayList<>();

            QueryManager queryManager = session.getWorkspace().getQueryManager();
            String expression = buildQuery(querySpec);

            Query query = queryManager.createQuery(expression, Query.JCR_SQL2);
            QueryResult queryResult = query.execute();

            NodeIterator nit = queryResult.getNodes();
            Node childNode;
            while (nit.hasNext()) {
                childNode = nit.nextNode();
                result.add(getFile(childNode));
            }

            time = System.nanoTime() - time;
            final long timeMs = time / 1000000;
            log.debug("executed in {} ms. ({})", timeMs, expression);

            return result;
        });
    }

    @Override
    public void deleteByPath(String identifier) {

        throw new NotImplementedException("Manual deletion of JCR files is prohibited. Use 'JcrStored' interface to bind deletion of JCR entry to deletion of Hibernate entity.");
    }

    private String escapePath(final String path) {

        final String leadingString = Objects.equals(path.charAt(0), '/') ? "/" : "";
        return leadingString + Stream.of(StringUtils.split(path, '/'))
                .map(Text::escapeIllegalJcrChars)
                .collect(Collectors.joining("/"));
    }

    private String replaceBackSlashes(final String path) {

        return path.replace('\\', '/');
    }
    
    private String fixPath(final String path) {
        return escapePath(replaceBackSlashes(path));
    }

    // NOTE:
    // Yes, I haven't found query builder for JCR SQL
    private String buildQuery(QuerySpec querySpec) {

        String query = "SELECT * FROM [nt:base] AS node";

        List<String> joinList = new ArrayList<>();
        List<String> filterConditions = new ArrayList<>();

        if (querySpec.getPath() != null) {
            String operator = querySpec.isSearchSubfolders() ? "ISDESCENDANTNODE" : "ISCHILDNODE";
            filterConditions.add(operator + "(node, '" + fixPath(querySpec.getPath()) + "')");
        }

        if (querySpec.getName() != null) {
            String operator = ObjectUtils.firstNonNull(querySpec.getNameLike(), false) ? " LIKE " : " = ";
            filterConditions.add("LOCALNAME(node) " + operator + " '" + querySpec.getName() + "'");
        }

        if (querySpec.getContentTypes() != null) {
            List<String> contentTypeConditions = new ArrayList<>();
            querySpec.getContentTypes().forEach(contentType -> contentTypeConditions.add("node.[" + JCR_CONTENT_TYPE + "] = '" + contentType + "'"));
            filterConditions.add("(" + String.join("\n OR ", contentTypeConditions) + ")");
        }

        if (joinList.size() > 0) {
            query += " \n" + String.join(" \n", joinList);
        }

        if (filterConditions.size() > 0) {
            query += "\n WHERE " + String.join("\n AND ", filterConditions);
        }

        // Sort by: folders first, then by name
        query += "\n ORDER BY node.[jcr:primaryType] DESC, LOCALNAME(node)";

        return query;
    }

    private Node getOrAddNestedFolder(Session session, String path) throws RepositoryException {

        Node node = session.getRootNode();

        if (!path.equals(PATH_SEPARATOR)) {
            List<String> pathParts = Arrays.stream(path.split(PATH_SEPARATOR)).filter(StringUtils::isNotBlank).collect(Collectors.toList());
            for (String folder : pathParts) {
                node = JcrUtils.getOrAddFolder(node, folder);
            }
        }

        return node;
    }

    private ArachneFileMeta getFile(Node fileNode) throws RepositoryException {

        return conversionService.convert(fileNode, ArachneFileMeta.class);
    }

    private Node saveFile(Node parentNode, String name, File file, Long createdById) throws RepositoryException, IOException {

        String mimeType = CommonFileUtils.getMimeType(file.getName(), file.getAbsolutePath());
        String contentType = CommonFileUtils.getContentType(file.getName(), file.getAbsolutePath());

        Node fileNode = JcrUtils.getOrAddNode(parentNode, name, JcrConstants.NT_FILE);

        fileNode.addMixin(MIX_ARACHNE_FILE);
        fileNode.setProperty(JCR_CONTENT_TYPE, contentType);
        fileNode.setProperty(JcrConstants.JCR_MIMETYPE, mimeType);
        fileNode.setProperty(JcrConstants.JCR_LASTMODIFIED, Calendar.getInstance());
        if (createdById != null) {
            fileNode.setProperty(JCR_AUTHOR, String.valueOf(createdById));
        }

        Node resNode = JcrUtils.getOrAddNode(fileNode, JcrConstants.JCR_CONTENT, JcrConstants.NT_RESOURCE);
        try (InputStream fileStream = new FileInputStream(file)) {
            Binary binary = resNode.getSession().getValueFactory().createBinary(fileStream);
            resNode.setProperty(JcrConstants.JCR_DATA, binary);
        }

        return fileNode;
    }

    public static String getStringProperty(Node node, String path) throws RepositoryException {

        return getStringProperty(node, path, null);
    }

    private static String getStringProperty(Node node, String path, String defaultVal) throws RepositoryException {

        String value = defaultVal;
        if (node.hasProperty(path)) {
            value = node.getProperty(path).getString();
        }
        return value;
    }
}
