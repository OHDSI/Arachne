package com.odysseusinc.arachne.jcr.service;

import org.hibernate.event.spi.DeleteEventListener;

public interface ContentIntegrityService {

    DeleteEventListener getHibernateDeleteEventListener();
}
