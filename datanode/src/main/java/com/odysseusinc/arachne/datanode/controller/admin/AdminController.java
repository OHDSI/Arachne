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

import com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult;
import com.odysseusinc.arachne.datanode.dto.converters.AnalysisToSubmissionDTOConverter;
import com.odysseusinc.arachne.datanode.dto.submission.SubmissionDTO;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.engine.EngineStatusDTO;
import com.odysseusinc.arachne.datanode.engine.EngineStatusService;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.repository.AnalysisRepository;
import com.odysseusinc.arachne.datanode.service.UserService;
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
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
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
    private AnalysisToSubmissionDTOConverter analysisToSubmissionDTO;
    @Autowired
    private AnalysisRepository analysisRepository;

    public AdminController() {
        initProps();
    }

    @ApiOperation(value = "Get all admins", hidden = true)
    @GetMapping("/api/v1/admin/admins")
    public JsonResult<List<UserDTO>> getAdmins(
            @RequestParam(name = "sortBy", required = false) String sortBy,
            @RequestParam(name = "sortAsc", required = false) Boolean sortAsc
    ) throws PermissionDeniedException {

        JsonResult<List<UserDTO>> result;
        List<User> users = userService.getAllAdmins(sortBy, sortAsc);
        List<UserDTO> dtos = users.stream()
                .map(UserService::toDto)
                .collect(Collectors.toList());
        result = new JsonResult<>(JsonResult.ErrorCode.NO_ERROR);
        result.setResult(dtos);
        return result;
    }

    @ApiOperation("Suggests user according to query to add admin")
    @GetMapping("/api/v1/admin/admins/suggest")
    public JsonResult<List<UserDTO>> suggestAdmins(
            Principal principal,
            @RequestParam("query") String query,
            @RequestParam(value = "limit", required = false) Integer limit
    ) {

        JsonResult<List<UserDTO>> result = new JsonResult<>(JsonResult.ErrorCode.NO_ERROR);
        userService
                .findByUsername(principal.getName())
                .ifPresent(user -> {
                    List<User> users = userService.suggestNotAdmin(user, query, limit == null ? SUGGEST_LIMIT : limit);
                    result.setResult(users.stream().map(UserService::toDto)
                            .collect(Collectors.toList())
                    );
                });
        return result;
    }

    @ApiOperation("Remove admin")
    @DeleteMapping("/api/v1/admin/admins/{username:.+}")
    public JsonResult<?> removeAdmin(@PathVariable String username) {

        userService.findByUsername(username).ifPresent(user -> userService.remove(user.getId()));
        return new JsonResult<>(JsonResult.ErrorCode.NO_ERROR);
    }

    @ApiOperation(value = "list submissions")
    @GetMapping("/api/v1/admin/submissions")
    public Page<SubmissionDTO> list(@PageableDefault(value = DEFAULT_PAGE_SIZE, sort = "id",
            direction = Sort.Direction.DESC) Pageable pageable) {

        Pageable p = isCustomSort(pageable) ? buildPageRequest(pageable) : pageable;
        Page<Analysis> analyses;
        if (isFinishedSort(pageable)) {
            analyses = analysisRepository.findAllPagedOrderByFinished(p);
        } else if (isSubmittedSort(pageable)) {
            analyses = analysisRepository.findAllPagedOrderBySubmitted(p);
        } else if (isStatusSort(pageable)) {
            analyses = analysisRepository.findAllPagedOrderByState(p);
        } else {
            analyses = analysisRepository.findAll(p);
        }
        Page<SubmissionDTO> items = analyses.map(analysis -> analysisToSubmissionDTO.convert(analysis));
        EngineStatusDTO engineStatus = engine.getStatusInfo();
        return new PageWithStatus(items, engineStatus);
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
        propertiesMap.put("status", p -> p.add("journal.state"));
    }

    protected User getAdmin(Principal principal) throws PermissionDeniedException {

        final User user = userService.getUser(principal);
        if (!user.getRoles().stream().anyMatch(role -> role.getName().equalsIgnoreCase("ROLE_ADMIN"))) {
            throw new PermissionDeniedException("Access denied");
        }
        return user;
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
