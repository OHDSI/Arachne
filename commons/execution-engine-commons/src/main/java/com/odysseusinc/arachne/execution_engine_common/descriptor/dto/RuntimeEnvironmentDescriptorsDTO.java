package com.odysseusinc.arachne.execution_engine_common.descriptor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RuntimeEnvironmentDescriptorsDTO {

    @JsonProperty
    private boolean docker;
    @JsonProperty
    private List<TarballEnvironmentDTO> descriptors;

}
