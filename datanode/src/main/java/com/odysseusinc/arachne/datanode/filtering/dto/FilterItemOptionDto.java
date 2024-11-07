package com.odysseusinc.arachne.datanode.filtering.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
@Getter
@Setter
public class FilterItemOptionDto {
    private String label;
    private String labelKey;
    private Long count;

}
