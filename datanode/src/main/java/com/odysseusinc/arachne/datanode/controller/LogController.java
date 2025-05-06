package com.odysseusinc.arachne.datanode.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class LogController {

    @Value("${logging.file.name}")
    private String logFilePath;


    /**
     * This method handles requests to retrieve logs.
     * It supports Range queries (e.g., "Range: bytes=-1048576" for the last 1 MB of the file).
     *
     * @return ResponseEntity<Resource> containing the log file content.
     */
    @RequestMapping(method = RequestMethod.GET, value = "/api/v1/application/logs/")
    public ResponseEntity<Resource> getLogs() {
        return ResponseEntity.ok().body(
                new FileSystemResource(logFilePath)
        );
    }

}
