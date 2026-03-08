/*
 * Copyright 2026 Odysseus Data Services/EPAM, Darwin EU, OHDSI
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.odysseusinc.arachne.datanode.service.study;

import com.odysseusinc.arachne.datanode.model.study.StudyPackage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * On startup, checks that every installed study (DB record) has its Docker image present locally.
 * Logs a warning for each missing image so it is visible in logs and can be surfaced in the UI
 * (list API returns imageInstalled=false; user can click Refresh to run docker pull).
 */
@Component
public class StudyImageStartupChecker {

    private static final Logger LOG = LoggerFactory.getLogger(StudyImageStartupChecker.class);

    private final boolean requireDockerAtStartup;
    private final StudyRepositoryPersistenceService studyService;
    private final StudyContainerService containerService;

    public StudyImageStartupChecker(@Value("${datanode.studyRepository.requireDocker:true}") boolean requireDockerAtStartup,
                                    StudyRepositoryPersistenceService studyService,
                                    StudyContainerService containerService) {
        this.requireDockerAtStartup = requireDockerAtStartup;
        this.studyService = studyService;
        this.containerService = containerService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void checkInstalledStudiesHaveImage() {
        if (requireDockerAtStartup) {
            containerService.requireDockerAvailable();
            LOG.info("Docker availability check passed on startup.");
        }
        Set<String> localImages = containerService.listLocalImageNames();
        for (StudyPackage pkg : studyService.findAllStudyPackages()) {
            String catalogAddress = pkg.getCatalogAddress();
            if (catalogAddress == null || catalogAddress.isBlank()) {
                continue;
            }
            String imageName = StudyContainerService.imageNameFor(
                    catalogAddress, pkg.getName(), pkg.getVersion());
            if (!StudyContainerService.hasImageInSet(localImages, imageName)) {
                LOG.warn("Study image not found locally: {} (study package id={}, name={}, version={}). "
                                + "Use Refresh in the UI to run 'docker pull' for this study.",
                        imageName, pkg.getId(), pkg.getName(), pkg.getVersion());
            }
        }
    }
}
