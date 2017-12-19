package com.odysseusinc.arachne.jcr.service;

import com.odysseusinc.arachne.jcr.model.JcrStored;
import java.util.Set;
import org.hibernate.HibernateException;
import org.hibernate.event.spi.DeleteEvent;
import org.hibernate.event.spi.DeleteEventListener;
import org.springframework.stereotype.Service;

@Service
public class ContentIntegrityServiceImpl implements ContentIntegrityService {

    private ExtendedContentStorageService contentStorageService;

    public ContentIntegrityServiceImpl(ExtendedContentStorageService contentStorageService) {

        this.contentStorageService = contentStorageService;
    }

    @Override
    public DeleteEventListener getHibernateDeleteEventListener() {

        return new DeleteEventListener() {

            @Override
            public void onDelete(DeleteEvent event) throws HibernateException {

                Object entity = event.getObject();
                if (entity instanceof JcrStored) {
                    contentStorageService.deleteByPath(((JcrStored) entity).getPath());
                }
            }

            @Override
            public void onDelete(DeleteEvent event, Set transientEntities) throws HibernateException {

            }
        };
    }
}
