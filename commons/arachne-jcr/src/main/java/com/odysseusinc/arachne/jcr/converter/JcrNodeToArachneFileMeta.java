package com.odysseusinc.arachne.jcr.converter;

import static com.odysseusinc.arachne.jcr.service.ContentStorageServiceImpl.JCR_AUTHOR;
import static com.odysseusinc.arachne.jcr.service.ContentStorageServiceImpl.JCR_CONTENT_TYPE;

import com.odysseusinc.arachne.commons.utils.CommonFileUtils;
import com.odysseusinc.arachne.jcr.model.ArachneFileMeta;
import com.odysseusinc.arachne.jcr.model.ArachneFileMetaImpl;
import com.odysseusinc.arachne.jcr.service.ContentStorageServiceImpl;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.jackrabbit.JcrConstants;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.stereotype.Component;

@Component
public class JcrNodeToArachneFileMeta implements Converter<Node, ArachneFileMeta>, InitializingBean {

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
            result.setName(node.getName());
            result.setPath(node.getPath());
            result.setCreated(node.getProperty(JcrConstants.JCR_CREATED).getDate().getTime());

            if (node.hasNode(JcrConstants.JCR_CONTENT)) {
                Node resNode = node.getNode(JcrConstants.JCR_CONTENT);
                result.setUpdated(resNode.getProperty(JcrConstants.JCR_LASTMODIFIED).getDate().getTime());
                result.setContentType(ContentStorageServiceImpl.getStringProperty(resNode, JCR_CONTENT_TYPE));
                result.setCreatedBy(NumberUtils.createLong(ContentStorageServiceImpl.getStringProperty(resNode, JCR_AUTHOR)));
            } else {
                result.setContentType(CommonFileUtils.TYPE_FOLDER);
            }
        } catch (RepositoryException ex) {
            return null;
        }

        return result;
    }
}
