package com.odysseusinc.arachne.storage.converter;

import static com.odysseusinc.arachne.storage.service.JcrContentStorageServiceImpl.JCR_AUTHOR;
import static com.odysseusinc.arachne.storage.service.JcrContentStorageServiceImpl.JCR_CONTENT_TYPE;

import com.odysseusinc.arachne.commons.utils.CommonFileUtils;
import com.odysseusinc.arachne.storage.model.ArachneFileMeta;
import com.odysseusinc.arachne.storage.model.ArachneFileMetaImpl;
import com.odysseusinc.arachne.storage.service.JcrContentStorageServiceImpl;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.Arrays;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.util.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Component;

@Component
public class JcrNodeToArachneFileMeta implements Converter<Node, ArachneFileMeta>, InitializingBean {

    private static Logger log = LoggerFactory.getLogger(JcrNodeToArachneFileMeta.class);

    @Autowired
    protected GenericConversionService conversionService;

    @Override
    public void afterPropertiesSet() throws Exception {

        conversionService.addConverter(this);
    }

    @Override
    public ArachneFileMeta convert(Node node) {

        ArachneFileMetaImpl result = new ArachneFileMetaImpl();

        try {
            result.setUuid(node.getIdentifier());
            result.setPath(Text.unescape(node.getPath()));
            result.setCreated(node.getProperty(JcrConstants.JCR_CREATED).getDate().getTime());

            if (node.isNodeType(JcrConstants.NT_FOLDER)) {
                result.setContentType(CommonFileUtils.TYPE_FOLDER);
            } else {
                if (hasArachneMixin(node)) {
                    result.setUpdated(node.getProperty(JcrConstants.JCR_LASTMODIFIED).getDate().getTime());
                    result.setContentType(JcrContentStorageServiceImpl.getStringProperty(node, JCR_CONTENT_TYPE));
                    result.setCreatedBy(NumberUtils.createLong(JcrContentStorageServiceImpl.getStringProperty(node, JCR_AUTHOR)));
                } else {
                    log.warn("Unwanted behaviour: JCR file node doesn't have Arachne mixin. " +
                            "Resolving content type dynamically - this will seriously decrease performance");
                    Node resNode = node.getNode(JcrConstants.JCR_CONTENT);
                    InputStream stream = resNode.getProperty(JcrConstants.JCR_DATA).getBinary().getStream();
                    String contentType = CommonFileUtils.getContentType(result.getName(), new ByteArrayResource(IOUtils.toByteArray(stream)));
                    result.setContentType(contentType);
                }
            }
        } catch (RepositoryException ex) {
            return new ArachneFileMetaImpl();
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }

        return result;
    }

    private boolean hasArachneMixin(Node node) throws RepositoryException {

        return Arrays.asList(node.getMixinNodeTypes()).stream()
                .anyMatch(t -> t.isNodeType(JcrContentStorageServiceImpl.MIX_ARACHNE_FILE));
    }
}
