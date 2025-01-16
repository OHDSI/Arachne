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
package com.odysseusinc.arachne.datanode.controller.analysis;

import com.odysseusinc.arachne.datanode.dto.analysis.AnalysisFileDTO;
import com.odysseusinc.arachne.datanode.service.AnalysisResultsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/analysis/{parentId}/results")
public class AnalysisResultsController {
    @Autowired
    private AnalysisResultsService analysisResultsService;

    @GetMapping("/list")
    public List<AnalysisFileDTO> listResultFiles(@PathVariable("parentId") Long parentId) {
        return analysisResultsService.getAnalysisResults(parentId);
    }

    @GetMapping("/list/**")
    public ResponseEntity<Resource> getResultFile(
            @PathVariable("parentId") Long parentId,
            HttpServletRequest request
    ) throws IOException {
        String filename = extractFilename(request);
        Resource resource = analysisResultsService.getAnalysisResultFile(parentId, filename);
        ContentDisposition disposition = ContentDisposition.attachment().filename(filename).build();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(Paths.get(resource.toString())))
                .body(resource);
    }

    private String extractFilename(HttpServletRequest request) throws IOException {
        String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String decodedPath = URLDecoder.decode(path, StandardCharsets.UTF_8.name());
        return new AntPathMatcher().extractPathWithinPattern(bestMatchPattern, decodedPath);
    }

}
