package com.odysseusinc.arachne.commons.utils.strategus;

import com.odysseusinc.arachne.commons.utils.CommonObjectJson;
import com.odysseusinc.arachne.commons.utils.annotations.OptionalField;

import java.util.List;

public class StrategusExpression extends CommonObjectJson {

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
