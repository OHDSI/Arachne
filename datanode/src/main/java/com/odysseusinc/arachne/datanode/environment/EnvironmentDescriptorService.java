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


import com.odysseusinc.arachne.datanode.environment.EnvironmentDescriptor.Type;
import com.odysseusinc.arachne.datanode.environment.EnvironmentDto.Docker;
import com.odysseusinc.arachne.datanode.environment.EnvironmentDto.Tarball;
import com.odysseusinc.arachne.datanode.util.JpaSugar;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.EngineStatus.Environments;
import com.odysseusinc.arachne.execution_engine_common.descriptor.dto.TarballEnvironmentDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.metamodel.SingularAttribute;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class EnvironmentDescriptorService {

    @PersistenceContext
    private EntityManager em;

    private volatile Environments environments;

    @Transactional
    public EnvironmentDescriptor ensureImageExists(String label, String descriptorId) {
        String safeId = Optional.ofNullable(descriptorId).orElse(label);
        return by((cb, root) -> cb.and(
                cb.equal(root.get(EnvironmentDescriptor_.label), label),
                cb.equal(root.get(EnvironmentDescriptor_.descriptorId), safeId)
        )).orElseGet(() ->
                create(Type.DOCKER, label, safeId, null)
        );
    }

    @Transactional
    public EnvironmentDescriptor ensureTarballExists(String descriptorId) {
        TarballEnvironmentDTO environment = Optional.ofNullable(environments).map(Environments::getTarball).flatMap(envs ->
                envs.stream().filter(env -> Objects.equals(env.getId(), descriptorId)).findFirst()
        ).orElseGet(() -> {
            // Engine config has changed before we synced up and user submitted analysis at that exact moment.
            // Failing here would result in transaction rollback, so we have to accept the situation for what it is.
            return new TarballEnvironmentDTO(descriptorId, descriptorId, null, null);
        });

        String json = SerializationUtils.serialize(environment);
        return by((cb, root) -> cb.and(
                cb.equal(root.get(EnvironmentDescriptor_.label), environment.getLabel()),
                cb.equal(root.get(EnvironmentDescriptor_.descriptorId), descriptorId)
        )).filter(descriptor -> json.equals(descriptor.getJson())).orElseGet(() ->
                create(Type.TARBALL, environment.getBundleName(), descriptorId, json)
        );
    }


    @Transactional
    public void updateDescriptors(Environments update) {
        logIfDiffers(update, Environments::getDocker, desc ->
                log.info("DOCKER image [{}]: {}", desc.getImageId(), desc.getTags())
        );
        logIfDiffers(update, Environments::getTarball, desc ->
                log.info("TARBALL descriptor [{}] ({}) -> [{}]", desc.getId(), desc.getLabel(), desc.getBundleName())
        );
        environments = update;
    }

    private <T> void logIfDiffers(Environments update, Function<Environments, List<T>> resolver, Consumer<T> statement) {
        Integer size = Optional.ofNullable(environments).map(resolver).map(List::size).orElse(0);
        List<T> latest = Optional.ofNullable(update).map(resolver).orElseGet(Collections::emptyList);
        if (size != latest.size()) {
            latest.forEach(statement);
        }
    }

    @Transactional
    public Optional<EnvironmentDescriptor> byDescriptorId(String descriptorId) {
        return by(EnvironmentDescriptor_.descriptorId, descriptorId);
    }

    @Transactional
    public Optional<EnvironmentDescriptor> by(SingularAttribute<EnvironmentDescriptor, String> attribute, String value) {
        return by((cb, root) -> cb.equal(root.get(attribute), value));
    }

    private Optional<EnvironmentDescriptor> by(BiFunction<CriteriaBuilder, Path<EnvironmentDescriptor>, Predicate> fnPredicate) {
        CriteriaQuery<EnvironmentDescriptor> cq = JpaSugar.query(em, EnvironmentDescriptor.class, (cb, query) -> {
            Root<EnvironmentDescriptor> root = query.from(EnvironmentDescriptor.class);
            return query.select(root).where(fnPredicate.apply(cb, root));
        });
        return em.createQuery(cq).getResultStream().findFirst();
    }

    @Transactional
    public EnvironmentDto listEnvironments() {
        List<Docker> docker = Optional.ofNullable(environments.getDocker()).map(envs ->
                envs.stream().map(env ->
                        Docker.of(env.getImageId(), env.getTags())
                ).collect(Collectors.toList())
        ).orElse(null);

        List<Tarball> tarball = Optional.ofNullable(environments.getTarball()).map(envs ->
                envs.stream().map(env ->
                        Tarball.of(env.getId(), env.getLabel(), env.getBundleName(), SerializationUtils.serialize(env))
                ).collect(Collectors.toList())
        ).orElse(null);
        return EnvironmentDto.of(docker, tarball);
    }

    private EnvironmentDescriptor create(String type, String label, String descriptorId, String json) {
        log.info("Registered [{}] env [{}] - [{}]", type, label, descriptorId);
        EnvironmentDescriptor entity = new EnvironmentDescriptor();
        entity.setType(type);
        entity.setDescriptorId(descriptorId);
        entity.setBase(Optional.ofNullable(descriptorId).map(id -> id.toLowerCase().startsWith("default")).orElse(false));
        entity.setLabel(label);
        entity.setJson(json);
        em.persist(entity);
        return entity;
    }


}
