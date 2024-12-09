/*
 * Copyright 2018, 2024 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.filtering.dto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class PPage<T> extends PageImpl<T> {
    private final List<String> actions;

    public static<T> PPage<T> of(List<String> actions, Page<T> page) {
        return of(actions, page.getContent(), page.getPageable(), page.getTotalElements());
    }

    public static<T> PPage<T> of(List<String> actions, List<T> content) {
        return new PPage<>(actions, content);
    }

    public static<T> PPage<T> of(List<String> actions, List<T> content, Pageable pageable, long total) {
        return new PPage<>(actions, content, pageable, total);
    }

    public PPage(List<String> actions, List<T> content, Pageable pageable, long total) {
        super(content, pageable, total);
        this.actions = actions;
    }

    public PPage(List<String> actions, List<T> content) {
        super(content);
        this.actions = actions;
    }
}