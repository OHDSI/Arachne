/*
 * Copyright 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.commons.utils.strategus;

import com.odysseusinc.arachne.commons.utils.CommonObjectJson;
import com.odysseusinc.arachne.commons.utils.annotations.OptionalField;

import java.util.List;

public class StrategusExpression extends CommonObjectJson {

    @OptionalField
    private Metadata metadata;
    private List<SharedResource> sharedResources;
    @OptionalField
    private List<ModuleSpecification> moduleSpecifications;
    private String attr_class;

    public Metadata getMetadata() {
        return metadata;
    }

    public void setMetadata(Metadata metadata) {
        this.metadata = metadata;
    }

    public List<SharedResource> getSharedResources() {
        return sharedResources;
    }

    public void setSharedResources(List<SharedResource> sharedResources) {
        this.sharedResources = sharedResources;
    }

    public List<ModuleSpecification> getModuleSpecifications() {
        return moduleSpecifications;
    }

    public void setModuleSpecifications(List<ModuleSpecification> moduleSpecifications) {
        this.moduleSpecifications = moduleSpecifications;
    }

    public static class Metadata {
        @OptionalField
        private String externalUuid;
        private String name;
        private String objectives;
        private String type;

        public String getExternalUuid() {
            return externalUuid;
        }

        public void setExternalUuid(String externalUuid) {
            this.externalUuid = externalUuid;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getObjectives() {
            return objectives;
        }

        public void setObjectives(String objectives) {
            this.objectives = objectives;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }

    public static class SharedResource {
    }

    public static class ModuleSpecification {
        private String module;
        private String version;
        private String remoteRepo;
        private String remoteUsername;

        public String getModule() {
            return module;
        }

        public void setModule(String module) {
            this.module = module;
        }

        public String getVersion() {
            return version;
        }

        public void setVersion(String version) {
            this.version = version;
        }

        public String getRemoteRepo() {
            return remoteRepo;
        }

        public void setRemoteRepo(String remoteRepo) {
            this.remoteRepo = remoteRepo;
        }

        public String getRemoteUsername() {
            return remoteUsername;
        }

        public void setRemoteUsername(String remoteUsername) {
            this.remoteUsername = remoteUsername;
        }
    }

}
