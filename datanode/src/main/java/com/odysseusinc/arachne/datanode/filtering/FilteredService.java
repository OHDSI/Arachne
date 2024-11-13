package com.odysseusinc.arachne.datanode.filtering;

import com.odysseusinc.arachne.datanode.filtering.dto.FilterDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public interface FilteredService<T> {

    FilterDto getFilters(Map<String, List<String>> options);

    Page<T> list(Map<String, List<String>> options, Pageable page);

    /**
     * Returns all possible sort options.
     */
    default Collection<String> getSorts() {
        return Collections.emptyList();
    }
}
