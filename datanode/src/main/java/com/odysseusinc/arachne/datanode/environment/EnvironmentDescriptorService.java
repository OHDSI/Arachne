/*
 * Copyright 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.environment;


import com.odysseusinc.arachne.datanode.service.client.engine.AnalysisExecutionException;
import com.odysseusinc.arachne.datanode.service.client.engine.ExecutionEngineClient;
import com.odysseusinc.arachne.datanode.util.JpaSugar;
import com.odysseusinc.arachne.execution_engine_common.descriptor.dto.RuntimeEnvironmentDescriptorDTO;
import com.odysseusinc.arachne.execution_engine_common.descriptor.dto.RuntimeEnvironmentDescriptorsDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class EnvironmentDescriptorService {
    volatile boolean firstFetch = true;

    private final Optional<Supplier<RuntimeEnvironmentDescriptorsDTO>> fetchDescriptors;
    private final Clock clock = Clock.systemUTC();

    @PersistenceContext
    private EntityManager em;

    private volatile boolean docker;

    public EnvironmentDescriptorService(ExecutionEngineClient client) {
        this.fetchDescriptors = client.getDescriptors();
    }

    @Scheduled(fixedDelayString = "${execution.descriptors.delayMs:60000}")
    @Transactional
    public void updateDescriptors() {
        fetchDescriptors.map(this::getDescriptors).ifPresent(descriptorsDTO -> {
            Map<String, List<EnvironmentDescriptor>> index = getAll().collect(
                    Collectors.groupingBy(EnvironmentDescriptor::getDescriptorId)
            );
            Instant now = clock.instant();
            docker = descriptorsDTO.isDocker();
            List<Long> updated = descriptorsDTO.getDescriptors().stream().map(dto -> {
                String json = SerializationUtils.serialize(dto);
                return Optional.ofNullable(index.get(dto.getId())).flatMap(entities -> {
                    Map<Boolean, List<EnvironmentDescriptor>> matches = entities.stream().collect(Collectors.partitioningBy(entity ->
                            Objects.equals(entity.getJson(), json)
                    ));
                    return matches.get(true).stream().findFirst().map(descriptor -> {
                         descriptor.setTerminated(null);
                         return descriptor;
                    });
                }).orElseGet(create(dto, SerializationUtils.serialize(dto)));
            }).map(EnvironmentDescriptor::getId).collect(Collectors.toList());
            log.debug("Processed {} descriptors", updated.size());
            getActive().filter(descriptor ->
                    !updated.contains(descriptor.getId())
            ).forEach(desc -> {
                log.info("Terminated descriptor {} [{}]", desc.getId(), desc.getDescriptorId());
                desc.setTerminated(now);
            });
            if (firstFetch) {
                firstFetch = false;
                getAll().forEach(dto ->
                        log.info("Validated descriptor #{} [{}] - [{}], {} bytes", dto.getId(), dto.getDescriptorId(), dto.getLabel(), dto.getJson().length())
                );
            }
        });
    }

    private RuntimeEnvironmentDescriptorsDTO getDescriptors(Supplier<RuntimeEnvironmentDescriptorsDTO> supplier) {
        try {
            return supplier.get();
        } catch (AnalysisExecutionException e) {
            // Suppress stacktrace for a known exception to avoid log pollution
            log.error(e.getMessage());
            return null;
        }
    }

    @Transactional
    public EnvironmentDescriptor byId(Long id) {
        return em.find(EnvironmentDescriptor.class, id);
    }

    @Transactional
    public Optional<EnvironmentDescriptor> byDescriptorId(String descriptorId) {
        CriteriaQuery<EnvironmentDescriptor> cq = JpaSugar.query(em, EnvironmentDescriptor.class, (cb, query) -> {
            Root<EnvironmentDescriptor> root = query.from(EnvironmentDescriptor.class);
            return query.select(root).where(
                    cb.equal(root.get(EnvironmentDescriptor_.descriptorId), descriptorId)
            );
        });
        return em.createQuery(cq).getResultStream().findFirst();
    }

    @Transactional
    public EnvironmentDto listEnvironments() {
        return EnvironmentDto.of(docker, listActive());
    }

    @Transactional
    public List<EnvironmentDescriptorDto> listActive() {
        return getActive().map(entity ->
                EnvironmentDescriptorDto.of(entity.getId(), entity.getDescriptorId(), entity.getLabel(), entity.getJson())
        ).collect(Collectors.toList());
    }

    private Stream<EnvironmentDescriptor> getActive() {
        return getAll().filter(descriptor ->
                descriptor.getTerminated() == null
        );
    }

    private Stream<EnvironmentDescriptor> getAll() {
        return JpaSugar.selectAll(em, EnvironmentDescriptor.class).getResultStream();
    }

    private Supplier<EnvironmentDescriptor> create(RuntimeEnvironmentDescriptorDTO dto, String json) {
        return () -> {
            log.info("Created descriptor [{}] - [{}], bundle name [{}]", dto.getId(), dto.getLabel(), dto.getBundleName());
            EnvironmentDescriptor entity = new EnvironmentDescriptor();
            entity.setDescriptorId(dto.getId());
            entity.setBase(dto.getId().toLowerCase().startsWith("default"));
            entity.setLabel(dto.getLabel());
            entity.setJson(json);
            em.persist(entity);
            return entity;
        };
    }


}
