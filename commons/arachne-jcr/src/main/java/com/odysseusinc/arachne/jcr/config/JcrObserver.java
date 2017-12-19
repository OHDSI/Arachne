package com.odysseusinc.arachne.jcr.config;

import javax.annotation.PostConstruct;
import javax.jcr.observation.Event;
import javax.jcr.observation.EventListener;
import javax.jcr.observation.ObservationManager;
import org.apache.jackrabbit.JcrConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springmodules.jcr.JcrTemplate;

@Configuration
public class JcrObserver {

    @Autowired
    private JcrTemplate jcrTemplate;

    @PostConstruct
    public void registerListeners() {

        jcrTemplate.execute(
                (session) -> {
                    ObservationManager observationManager = session.getWorkspace().getObservationManager();
                    observationManager.addEventListener(
                            getDeleteEventListener(),
                            Event.NODE_REMOVED,
                            "/",
                            true,
                            null,
                            new String[]{JcrConstants.NT_FOLDER, JcrConstants.NT_FILE},
                            false
                    );
                    return null;
                },
                true
        );
    }

    private EventListener getDeleteEventListener() {

        return events -> {
            while (events.hasNext()) {
                Event event = events.nextEvent();

            }
        };
    }
}
