package com.odysseusinc.arachne.storage.service;

import org.hibernate.event.spi.DeleteEventListener;

public interface JcrContentIntegrityService {

    DeleteEventListener getHibernateDeleteEventListener();
}
