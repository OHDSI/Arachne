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

import com.odysseusinc.arachne.datanode.dto.submission.SubmissionDTO;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.engine.EngineStatusDTO;
import com.odysseusinc.arachne.datanode.engine.EngineStatusService;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.UserService;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
public class AdminController {

    public static final int SUGGEST_LIMIT = 10;
    public static final int DEFAULT_PAGE_SIZE = 10;
    private final Map<String, Consumer<List<String>>> propertiesMap = new HashMap<>();
    @Autowired
    protected UserService userService;
    @Autowired
    private EngineStatusService engine;
    @Autowired
    private AnalysisListService analysisListService;

    public AdminController() {
        initProps();
    }

    @ApiOperation(value = "Get all admins", hidden = true)
    @GetMapping("/api/v1/admin/admins")
    public List<UserDTO> getAdmins(
            @RequestParam(name = "sortBy", required = false) String sortBy,
            @RequestParam(name = "sortAsc", required = false) Boolean sortAsc
    ) throws PermissionDeniedException {

        List<User> users = userService.getAllAdmins(sortBy, sortAsc);
        List<UserDTO> dtos = users.stream()
                .map(UserService::toDto)
                .collect(Collectors.toList());
        return dtos;
    }

    @ApiOperation("Suggests user according to query to add admin")
    @GetMapping("/api/v1/admin/admins/suggest")
    public Optional<List<UserDTO>> suggestAdmins(
            Principal principal,
            @RequestParam("query") String query,
            @RequestParam(value = "limit", required = false) Integer limit
    ) {
        User user = userService.getUser(principal);
        List<User> users = userService.suggestNotAdmin(user, query, limit == null ? SUGGEST_LIMIT : limit);
        return Optional.of(users.stream().map(UserService::toDto).collect(Collectors.toList()));
    }

    @ApiOperation("Remove admin")
    @DeleteMapping("/api/v1/admin/admins/{username:.+}")
    public void removeAdmin(@PathVariable String username) {
        userService.findByUsername(username).ifPresent(user ->
                userService.remove(user.getId())
        );
    }

    @ApiOperation(value = "list submissions")
    @GetMapping("/api/v1/admin/submissions")
    public Page<SubmissionDTO> list(@PageableDefault(value = DEFAULT_PAGE_SIZE, sort = "id",
            direction = Sort.Direction.DESC) Pageable pageable) {

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

    private boolean isStatusSort(final Pageable pageable) {

        return isSortOf(pageable, "status"::equals);
    }

    private boolean isSubmittedSort(final Pageable pageable) {

        return isSortOf(pageable, "submitted"::equals);
    }

    private boolean isFinishedSort(final Pageable pageable) {

        return isSortOf(pageable, "finished"::equals);
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
