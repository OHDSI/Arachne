package com.odysseusinc.arachne.datanode.filtering.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Singular;
import lombok.ToString;

@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
@Getter
public class FilterItemDto {

    private String labelKey;

    @Singular
    private List<FilterItemOptionDto> options;

}
