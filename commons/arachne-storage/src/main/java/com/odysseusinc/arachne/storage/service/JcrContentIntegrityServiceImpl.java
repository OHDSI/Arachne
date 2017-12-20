package com.odysseusinc.arachne.storage.service;

import com.odysseusinc.arachne.storage.model.JcrStored;
import java.util.Set;
import javax.jcr.Node;
import javax.persistence.EntityManagerFactory;
import org.hibernate.HibernateException;
import org.hibernate.event.spi.DeleteEvent;
import org.hibernate.event.spi.DeleteEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springmodules.jcr.JcrTemplate;

@Service
public class JcrContentIntegrityServiceImpl implements JcrContentIntegrityService {

    private JcrTemplate jcrTemplate;

    @Autowired
    public JcrContentIntegrityServiceImpl(JcrTemplate jcrTemplate) {

        this.jcrTemplate = jcrTemplate;
    }

    @Override
    public DeleteEventListener getHibernateDeleteEventListener() {

        return new DeleteEventListener() {

            @Override
            public void onDelete(DeleteEvent event) throws HibernateException {

                Object entity = event.getObject();
                if (entity instanceof JcrStored) {
                    deleteJcrEntryByPath(((JcrStored) entity).getPath());
                }
            }

            @Override
            public void onDelete(DeleteEvent event, Set transientEntities) throws HibernateException {

            }
        };
    }

    private void deleteJcrEntryByPath(String path) {

        jcrTemplate.execute(session -> {

            Node fileNode = session.getNode(path);
            fileNode.remove();
            session.save();
            return null;
        });
    }
}
