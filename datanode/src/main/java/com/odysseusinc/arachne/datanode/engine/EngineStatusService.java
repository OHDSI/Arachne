/*
 * Copyright 2024 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.engine;

import com.odysseusinc.arachne.datanode.util.JpaSugar;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

/**
 * Some statistics on the execution engine
 */
@Slf4j
@Service
public class EngineStatusService {
    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void update(Instant timestamp, String error, Runnable onChange) {
        getStatus().filter(status ->
                Objects.equals(status.getError(), error)
        ).orElseGet(() -> {
            ExecutionEngineStatus status = new ExecutionEngineStatus();
            status.setId(UUID.randomUUID());
            status.setSince(timestamp);
            status.setError(error);
            em.persist(status);
            onChange.run();
            return status;
        }).setSeenLast(timestamp);
    }

    @Transactional
    public EngineStatusDTO getStatusInfo() {
        return getStatus().map(status ->
                EngineStatusDTO.of(status.getError() == null ? "OK" : "ERROR", status.getSince(), status.getSince(), status.getError())
        ).orElseGet(() ->
                EngineStatusDTO.of("UNKNOWN", null, null, null)
        );
    }

    private Optional<ExecutionEngineStatus> getStatus() {
        return JpaSugar.select(em, ExecutionEngineStatus.class, (cb, query) -> root ->
            query.orderBy(cb.desc(root.get(ExecutionEngineStatus_.since)))
        ).getResultStream().findFirst();
    }

}
