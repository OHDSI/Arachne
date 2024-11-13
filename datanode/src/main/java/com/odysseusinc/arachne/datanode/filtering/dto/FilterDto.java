package com.odysseusinc.arachne.datanode.filtering.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
@Getter
public class FilterDto {

    private List<FilterItemDto> items;

}
