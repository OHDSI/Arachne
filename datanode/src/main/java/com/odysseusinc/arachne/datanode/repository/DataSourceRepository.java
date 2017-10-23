/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexandr Ryabokon, Vitaly Koulakov, Anton Gackovka, Maria Pozhidaeva, Mikhail Mironov
 * Created: November 01, 2016
 *
 */

package com.odysseusinc.arachne.datanode.repository;

import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

public interface DataSourceRepository extends JpaRepository<DataSource, Long> {

    @Modifying
    @Transactional
    @Query("delete from DataSource ds where ds.uuid = ?1")
    void deleteByUuid(String uuid);

    @Modifying
    void deleteByCentralId(Long centralId);

    @Query("from DataSource ds where ds.uuid = ?1")
    Optional<DataSource> findByUuid(String uuid);

    Optional<DataSource> findByCentralId(Long centralId);

    @Query("from DataSource ds where ds.id = ?1")
    Optional<DataSource> findById(Long id);

    @Query("select ds from DataSource ds where ds.registred = true")
    List<DataSource> findAllRegistered();

    Stream<DataSource> findAllByCentralIdIsNull();
}
