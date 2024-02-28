package com.odysseusinc.arachne.datanode.repository;

import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AnalysisRepositoryExtended {
  Page<Analysis> findAllPagingSortingByCalculateFields(String direction, String sortField,
      Pageable pageable);

}
