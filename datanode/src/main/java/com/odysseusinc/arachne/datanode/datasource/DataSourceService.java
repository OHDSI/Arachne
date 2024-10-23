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

package com.odysseusinc.arachne.datanode.datasource;

import com.google.common.collect.ImmutableMap;
import com.odysseusinc.arachne.commons.types.DBMSType;
import com.odysseusinc.arachne.datanode.Constants;
import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceDTO;
import com.odysseusinc.arachne.datanode.dto.datasource.WriteDataSourceDTO;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.ResourceConflictException;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource_;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.util.JpaSugar;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.DataSourceUnsecuredDTO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Root;
import javax.persistence.metamodel.SingularAttribute;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.BiFunction;

import static com.google.common.base.Preconditions.checkNotNull;

@Slf4j
@Service
@Transactional
public class DataSourceService {
    private final Map<String, SingularAttribute<DataSource, ?>> sorts;

    @Value("${cohorts.result.defaultTargetTable}")
    private String defaultCohortTargetTable;

    @PersistenceContext
    private EntityManager em;

    public DataSourceService() {
        sorts = ImmutableMap.of(
                "name", DataSource_.name,
                "dbmsType", DataSource_.type,
                "connectionString", DataSource_.connectionString,
                "cdmSchema", DataSource_.cdmSchema
        );
    }

    public List<DataSource> findAllNotDeleted(String sortBy, Boolean sortAsc) {
        return JpaSugar.select(em, DataSource.class, (cb, query) -> root ->
                query.where(
                        root.get(DataSource_.deletedAt).isNull()
                ).orderBy(
                        direction(sortAsc).apply(cb, field(sortBy, root))
                )
        ).getResultList();
    }

    public void delete(Long id) {
        em.remove(getById(id));
    }

    public DataSource getById(Long id) {
        checkNotNull(id, "given data source surrogate id is blank ");
        return Optional.ofNullable(em.find(DataSource.class, id)).orElseThrow(() ->
                new NotExistException("Data source " + id + " was not found", DataSource.class));
    }


    @Transactional
    public DataSourceDTO create(WriteDataSourceDTO dataSourceDTO, User admin, byte[] keyFile) {
        return failIfNameConflict(null, dataSourceDTO.getName()).orElseGet(() -> {
            DataSource dataSource = toEntity(dataSourceDTO, keyFile);
            em.persist(dataSource);
            return toDto(dataSource);
        });
    }

    @Transactional
    public DataSourceDTO update(WriteDataSourceDTO dataSourceDTO, Long id, User admin, Optional<byte[]> keyFile) {
        return failIfNameConflict(id, dataSourceDTO.getName()).orElseGet(() ->
                toDto(update(id, dataSourceDTO, keyFile))
        );
    }

    private Optional<DataSourceDTO> failIfNameConflict(Long idMaybe, String name) {
        return JpaSugar.select(em, DataSource.class, (cb, query) -> root -> query.where(
                cb.and(
                        Optional.ofNullable(idMaybe).map(id -> cb.notEqual(root.get(DataSource_.id), id)).orElseGet(cb::and),
                        root.get(DataSource_.deletedAt).isNull(),
                        cb.equal(root.get(DataSource_.name), name)
                )
        )).getResultStream().findFirst().map(conflict -> {
            throw new ResourceConflictException("Data source name [" + name + "] is not unique", ImmutableMap.of("name", "Name conflict with datasource [" + conflict.getId() + "] is not unique"));
        });
    }

    @Transactional(rollbackFor = Exception.class)
    public DataSource update(Long id, WriteDataSourceDTO dto, Optional<byte[]> keytab) {
        DataSource entity = getById(id);

        Optional.ofNullable(dto.getName()).ifPresent(entity::setName);
        Optional.ofNullable(dto.getDbmsType()).map(DBMSType::valueOf).ifPresent(type -> {
            entity.setType(type);
            if (DBMSType.IMPALA.equals(type)) {
                Optional.ofNullable(dto.getUseKerberos()).ifPresent(entity::setUseKerberos);
                Optional.ofNullable(dto.getKrbRealm()).ifPresent(entity::setKrbRealm);
                Optional.ofNullable(dto.getKrbFQDN()).ifPresent(entity::setKrbFQDN);
                Optional.ofNullable(dto.getKrbUser()).ifPresent(entity::setKrbUser);
                Optional.ofNullable(dto.getKrbPassword()).filter(this::isNotDummyPassword).ifPresent(entity::setName);
            } else {
                entity.setKrbRealm(null);
                entity.setKrbFQDN(null);
                entity.setKrbUser(null);
                entity.setKrbPassword(null);
            }

            if (DBMSType.BIGQUERY.equals(type) || DBMSType.IMPALA.equals(type)) {
                keytab.ifPresent(entity::setKeyfile);
            } else {
                entity.setKeyfile(null);
            }
        });
        Optional.ofNullable(dto.getCdmSchema()).ifPresent(entity::setCdmSchema);
        Optional.ofNullable(dto.getConnectionString()).ifPresent(entity::setConnectionString);
        Optional.ofNullable(dto.getDescription()).ifPresent(entity::setDescription);
        Optional.ofNullable(dto.getDbPassword()).filter(this::isNotDummyPassword).ifPresent(entity::setPassword);
        Optional.ofNullable(dto.getDbUsername()).ifPresent(entity::setUsername);

        Optional.ofNullable(dto.getResultSchema()).ifPresent(entity::setResultSchema);
        Optional.ofNullable(dto.getTargetSchema()).ifPresent(entity::setTargetSchema);
        Optional.ofNullable(dto.getCohortTargetTable()).ifPresent(entity::setCohortTargetTable);

        return entity;
    }

    @Transactional
    public void removeKeytab(Long id) {
        DataSource dataSource = getById(id);
        dataSource.setKeyfile(null);
    }

    private Path<?> field(String sortBy, Root<DataSource> root) {
        return root.get(sorts.getOrDefault(sortBy, DataSource_.name));
    }

    private static BiFunction<CriteriaBuilder, Path<?>, Order> direction(Boolean asc) {
        return (asc == Boolean.FALSE) ? CriteriaBuilder::desc : CriteriaBuilder::asc;
    }

    private static DataSource toEntity(WriteDataSourceDTO dataSourceDTO, byte[] keyFile) {
        DataSource dataSource = new DataSource();
        dataSource.setName(dataSourceDTO.getName());
        dataSource.setDescription(dataSourceDTO.getDescription());
        dataSource.setType(DBMSType.valueOf(dataSourceDTO.getDbmsType()));
        dataSource.setConnectionString(dataSourceDTO.getConnectionString());
        dataSource.setUsername(dataSourceDTO.getDbUsername());
        dataSource.setPassword(dataSourceDTO.getDbPassword());
        dataSource.setCdmSchema(dataSourceDTO.getCdmSchema());
        dataSource.setCohortTargetTable(dataSourceDTO.getCohortTargetTable());
        dataSource.setTargetSchema(dataSourceDTO.getTargetSchema());
        dataSource.setResultSchema(dataSourceDTO.getResultSchema());
        dataSource.setUseKerberos(dataSourceDTO.getUseKerberos());
        dataSource.setKrbFQDN(dataSourceDTO.getKrbFQDN());
        dataSource.setKrbRealm(dataSourceDTO.getKrbRealm());
        dataSource.setKrbUser(dataSourceDTO.getKrbUser());
        dataSource.setKrbPassword(dataSourceDTO.getKrbPassword());
        dataSource.setKrbAuthMechanism(dataSourceDTO.getKrbAuthMechanism());
        dataSource.setKeyfile(keyFile);
        return dataSource;
    }

    public static DataSourceDTO toDto(DataSource dataSource) {
        DataSourceDTO dto = new DataSourceDTO();
        dto.setId(dataSource.getId());
        dto.setName(dataSource.getName());
        dto.setCdmSchema(dataSource.getCdmSchema());
        dto.setConnectionString(dataSource.getConnectionString());
        dto.setDbmsType(String.valueOf(dataSource.getType()));
        dto.setDbUsername(dataSource.getUsername());
        dto.setDbPassword(dataSource.getPassword());
        dto.setDescription(dataSource.getDescription());
        dto.setUuid(dataSource.getUuid());

        dto.setResultSchema(dataSource.getResultSchema());
        dto.setTargetSchema(dataSource.getTargetSchema());
        dto.setCohortTargetTable(dataSource.getCohortTargetTable());

        dto.setHealthStatusDescription(dataSource.getHealthStatusDescription());

        dto.setUseKerberos(dataSource.getUseKerberos());
        dto.setKrbFQDN(dataSource.getKrbFQDN());
        dto.setKrbRealm(dataSource.getKrbRealm());
        dto.setKrbUser(dataSource.getKrbUser());
        dto.setHasKeytab(null != dataSource.getKeyfile());
        dto.setKrbPassword(dataSource.getKrbPassword());
        dto.setKrbAuthMechanism(dataSource.getKrbAuthMechanism());

        dto.setDbPassword(getMasqueradedPassword(dto.getDbPassword()));
        dto.setKrbPassword(getMasqueradedPassword(dto.getKrbPassword()));
        return dto;
    }

    public DataSourceUnsecuredDTO toUnsecuredDto(DataSource source) {
        DataSourceUnsecuredDTO target = new DataSourceUnsecuredDTO();
        target.setName(source.getName());
        target.setConnectionString(source.getConnectionString());
        target.setUsername(source.getUsername());
        target.setPassword(source.getPassword());
        final String cdmSchema = source.getCdmSchema();
        target.setCdmSchema(cdmSchema);
        target.setType(DBMSType.valueOf(source.getType().name()));
        final String targetSchema = source.getTargetSchema();
        target.setTargetSchema(StringUtils.isEmpty(targetSchema) ? cdmSchema : targetSchema);
        final String resultSchema = source.getResultSchema();
        target.setResultSchema(StringUtils.isEmpty(resultSchema) ? cdmSchema : resultSchema);
        final String cohortTargetTable = source.getCohortTargetTable();
        target.setCohortTargetTable(StringUtils.isEmpty(cohortTargetTable) ? defaultCohortTargetTable : cohortTargetTable);

        target.setUseKerberos(source.getUseKerberos());
        if (source.getUseKerberos()) {
            target.setKrbFQDN(source.getKrbFQDN());
            target.setKrbAdminFQDN(source.getKrbFQDN());
            target.setKrbRealm(source.getKrbRealm());
            target.setKrbUser(source.getKrbUser());
            target.setKrbPassword(source.getKrbPassword());
            target.setKrbAuthMethod(source.getKrbAuthMechanism());
        }
        target.setKeyfile(source.getKeyfile());

        return target;
    }

    private static String getMasqueradedPassword(String password) {
        return StringUtils.isEmpty(password) ? "" : Constants.DUMMY_PASSWORD;
    }

    private boolean isNotDummyPassword(String dbPassword) {
        return !Objects.equals(dbPassword, Constants.DUMMY_PASSWORD);
    }

}
