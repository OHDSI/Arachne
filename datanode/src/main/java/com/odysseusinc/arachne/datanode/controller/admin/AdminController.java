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

package com.odysseusinc.arachne.datanode.controller.admin;

import com.odysseusinc.arachne.datanode.service.user.UserListService;
import com.odysseusinc.arachne.datanode.dto.submission.SubmissionDTO;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.engine.EngineStatusDTO;
import com.odysseusinc.arachne.datanode.engine.EngineStatusService;
import com.odysseusinc.arachne.datanode.service.analysis.AnalysisListService;
import io.swagger.annotations.ApiOperation;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;

@RestController
public class AdminController {

    private final Map<String, Consumer<List<String>>> propertiesMap = new HashMap<>();

    @Autowired
    private EngineStatusService engine;
    @Autowired
    private AnalysisListService analysisListService;
    @Autowired
    private UserListService userListService;

    public AdminController() {
        initProps();
    }

    // TODO: This method is not implemented properly. The following things should be done in the future:
    // * The list returns a list of Users, not just admins, so it should be moved to the proper place.
    // * Return a Page instead of a List.
    @ApiOperation(value = "Get all admins", hidden = true)
    @GetMapping("/api/v1/admin/admins")
    public List<UserDTO> userList(@PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        PageRequest pageForList = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
        return userListService.list(Collections.emptyMap(), pageForList).getContent();
    }


    @ApiOperation(value = "list submissions")
    @GetMapping("/api/v1/admin/submissions")
    public Page<SubmissionDTO> submissionList(@PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        Pageable p = isCustomSort(pageable) ? buildPageRequest(pageable) : pageable;
        Page<SubmissionDTO> list = analysisListService.list(Collections.emptyMap(), p);
        EngineStatusDTO engineStatus = engine.getStatusInfo();
        return new PageWithStatus(list, engineStatus);
    }

    protected Pageable buildPageRequest(Pageable pageable) {
        List<String> properties = new LinkedList<>();
        Sort.Direction direction = Sort.Direction.ASC;
        for (Sort.Order order : pageable.getSort()) {
            direction = order.getDirection();
            String property = order.getProperty();
            if (propertiesMap.containsKey(property)) {
                propertiesMap.get(property).accept(properties);
            } else {
                properties.add(property);
            }
        }

        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), direction,
                properties.toArray(new String[properties.size()]));
    }

    private boolean isCustomSort(final Pageable pageable) {

        return isSortOf(pageable, propertiesMap::containsKey);
    }

    private boolean isSortOf(final Pageable pageable, Function<String, Boolean> predicate) {

        if (pageable.getSort() == null) {
            return false;
        }
        for (Sort.Order order : pageable.getSort()) {
            if (predicate.apply(order.getProperty())) {
                return true;
            }
        }
        return false;
    }

    protected void initProps() {

        propertiesMap.put("author.fullName", p -> {
            p.add("author.firstName");
            p.add("author.lastName");
        });
        propertiesMap.put("fullName", p -> {
            p.add("author.firstName");
            p.add("author.lastName");
        });
        propertiesMap.put("analysis", p -> p.add("title"));
        propertiesMap.put("study", p -> p.add("studyTitle"));
        propertiesMap.put("status", p -> p.add("status"));
    }

    @Getter
    public static class PageWithStatus extends PageImpl<SubmissionDTO> {
        private EngineStatusDTO engine;

        public PageWithStatus(Page<SubmissionDTO> page, EngineStatusDTO engine) {
            super(page.getContent(), page.getPageable(), page.getTotalElements());
            this.engine = engine;
        }
    }
}
