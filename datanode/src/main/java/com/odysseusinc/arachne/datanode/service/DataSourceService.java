/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.service;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonHealthStatus;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.model.datasource.AutoDetectedFields;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface DataSourceService {
    DataSource create(User owner, DataSource dataSource) throws NotExistException;

    List<DataSource> findAllNotDeleted();

    List<DataSource> findAllNotDeleted(String sortBy, Boolean sortAsc);

    void delete(Long id);

    void delete(DataSource dataSource);

    Optional<DataSource> findByCentralId(Long centralId);

    DataSource getById(Long id);

    DataSource update(User user, DataSource dataSource);

    @Transactional(rollbackFor = Exception.class)
    void updateOnCentral(User user, DataSource dataSource);

    void updateHealthStatus(Long centralId, CommonHealthStatus status, String description);

    AutoDetectedFields autoDetectFields(DataSource dataSource);

    void removeKeytab(DataSource dataSource);

    List<DataSource> findStandaloneSources();

    boolean isDatasourceNameUnique(String name, Long dataSourceId);

    void firstCheckCallbackProcess(Long id, String password, AnalysisResultDTO result, MultipartFile[] files);
}
