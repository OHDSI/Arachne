package com.odysseusinc.arachne.storage.service;


import com.odysseusinc.arachne.commons.utils.CommonFileUtils;
import com.odysseusinc.arachne.storage.model.ArachneFileSourced;
import com.odysseusinc.arachne.storage.model.ArachneFileMeta;
import com.odysseusinc.arachne.storage.model.QuerySpec;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;
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
import org.apache.jackrabbit.commons.JcrUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springmodules.jcr.JcrTemplate;

@Service
public class JcrContentStorageServiceImpl implements ContentStorageService {

    public static String PATH_SEPARATOR = "/";
    public static String ENTITY_FILES_DIR = "entities";

    public static String JCR_CONTENT_TYPE = "jcr:contentType";
    public static String JCR_AUTHOR = "jcr:author";

    protected JcrTemplate jcrTemplate;
    protected ConversionService conversionService;
    protected EntityManagerFactory entityManagerFactory;

    @Autowired
    public JcrContentStorageServiceImpl(JcrTemplate jcrTemplate,
                                        ConversionService conversionService,
                                        EntityManagerFactory entityManagerFactory) {

        this.jcrTemplate = jcrTemplate;
        this.conversionService = conversionService;
        this.entityManagerFactory = entityManagerFactory;
    }

    public String getLocationForEntity(String entityTableName, Serializable entityIdentifier, List<String> additionalPathParts) {

        List<String> pathParts = new ArrayList<>(Arrays.asList(ENTITY_FILES_DIR, entityTableName, entityIdentifier.toString()));

        pathParts.addAll(additionalPathParts);

        return PATH_SEPARATOR + pathParts.stream()
                .filter(part -> StringUtils.isNotBlank(part) && !part.equals(PATH_SEPARATOR))
                .collect(Collectors.joining(PATH_SEPARATOR));
    }

    public String getLocationForEntity(Object domainObject, List<String> additionalPathParts) {

        Table entityTable = domainObject.getClass().getAnnotation(Table.class);
        String entityId = String.valueOf(entityManagerFactory.getPersistenceUnitUtil().getIdentifier(domainObject));

        return getLocationForEntity(entityTable.name(), entityId, additionalPathParts);
    }

    @Override
    public ArachneFileSourced getFileByPath(String absoulteFilename) {

        return (ArachneFileSourced) jcrTemplate.execute(session -> {

            Node fileNode = session.getNode(absoulteFilename);
            return getFile(fileNode);
        });
    }

    public ArachneFileSourced getFileByIdentifier(String identifier) {

        return (ArachneFileSourced) jcrTemplate.execute(session -> {

            Node fileNode = session.getNodeByIdentifier(identifier);
            return getFile(fileNode);
        });
    }

    @Override
    public ArachneFileMeta saveFile(String filepath, File file, Long createdById) {

        Path path = Paths.get(filepath);

        String parentNodePath = path.getParent() != null ? path.getParent().toString() : "/";
        String name = path.getFileName().toString();

        String fixedPath = fixPath(parentNodePath);

        return (ArachneFileMeta) jcrTemplate.execute(session -> {

            Node targetDir = getOrAddNestedFolder(session, fixedPath);
            Node node = saveFile(targetDir, name, file, createdById);
            session.save();
            return conversionService.convert(node, ArachneFileMeta.class);
        });
    }

    @Override
    public List<ArachneFileSourced> searchFiles(QuerySpec querySpec) {

        return (List<ArachneFileSourced>) jcrTemplate.execute(session -> {

            List<ArachneFileSourced> result = new ArrayList<>();

            QueryManager queryManager = session.getWorkspace().getQueryManager();
            String expression = buildQuery(querySpec);

            Query query = queryManager.createQuery(expression, javax.jcr.query.Query.JCR_SQL2);
            QueryResult queryResult = query.execute();

            NodeIterator nit = queryResult.getNodes();
            Node childNode;
            while (nit.hasNext()) {
                childNode = nit.nextNode();
                result.add(getFile(childNode));
            }

            return result;
        });
    }

    @Override
    public void deleteByPath(String identifier) {

        throw new NotImplementedException("Manual deletion of JCR files is prohibited. Use 'JcrStored' interface to bind deletion of JCR entry to deletion of Hibernate entity.");
    }

    private String fixPath(String path) {

        return path.replace('\\', '/');
    }

    // NOTE:
    // Yes, I haven't found query builder for JCR SQL
    private String buildQuery(QuerySpec querySpec) {

        String query = "SELECT * FROM [nt:base] AS node";

        List<String> joinList = new ArrayList<>();
        List<String> filterConditions = new ArrayList<>();

        if (querySpec.getPath() != null) {
            filterConditions.add("ISCHILDNODE(node, '" + querySpec.getPath() + "')");
        }

        if (querySpec.getName() != null) {
            String operator = ObjectUtils.firstNonNull(querySpec.getNameLike(), false) ? " LIKE " : " = ";
            filterConditions.add("LOCALNAME() " + operator + " '" + querySpec.getName() + "'");
        }

        if (querySpec.getContentTypes() != null) {
            joinList.add("INNER JOIN [" + JcrConstants.JCR_CONTENT + "] as content ON ISCHILDNODE(child, node)");

            List<String> conentTypeConditions = new ArrayList<>();
            querySpec.getContentTypes().forEach(contentType -> conentTypeConditions.add("content.[" + JCR_CONTENT_TYPE + "] = '" + contentType + "'"));
            filterConditions.add("(" + String.join("\n OR ", conentTypeConditions) + ")");
        }

        if (joinList.size() > 0) {
            query += " \n" + String.join(" \n", joinList);
        }

        if (filterConditions.size() > 0) {
            query += "\n WHERE " + String.join("\n AND ", filterConditions);
        }

        // Sort by: folders first, then by name
        query += "\n ORDER BY [jcr:primaryType] DESC, LOCALNAME()";

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

    private ArachneFileSourced getFile(Node fileNode) throws RepositoryException {

        ArachneFileMeta arachneFileMeta = conversionService.convert(fileNode, ArachneFileMeta.class);
        ArachneFileSourced file = new ArachneFileSourced(arachneFileMeta);

        if (fileNode.hasNode(JcrConstants.JCR_CONTENT)) {
            Node resNode = fileNode.getNode(JcrConstants.JCR_CONTENT);
            InputStream stream = resNode.getProperty(JcrConstants.JCR_DATA).getBinary().getStream();
            file.setInputStream(stream);
        }

        return file;
    }

    private Node saveFile(Node parentNode, String name, File file, Long createdById) throws RepositoryException, IOException {

        String mimeType = CommonFileUtils.getMimeType(file.getName(), file.getAbsolutePath());
        String contentType = CommonFileUtils.getContentType(file.getName(), file.getAbsolutePath());

        Node fileNode = JcrUtils.getOrAddNode(parentNode, name, JcrConstants.NT_FILE);
        Node resNode = JcrUtils.getOrAddNode(fileNode, JcrConstants.JCR_CONTENT, JcrConstants.NT_RESOURCE);

        resNode.addMixin("mix:arachneFile");

        resNode.setProperty(JCR_CONTENT_TYPE, contentType);
        if (createdById != null) {
            resNode.setProperty(JCR_AUTHOR, String.valueOf(createdById));
        }
        resNode.setProperty(JcrConstants.JCR_MIMETYPE, mimeType);
        resNode.setProperty(JcrConstants.JCR_LASTMODIFIED, Calendar.getInstance());

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
