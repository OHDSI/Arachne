package com.odysseusinc.arachne.datanode.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Controller
public class LogController {

    @Value("${logging.file.name}")
    private String logFilePath;

    @RequestMapping(method = RequestMethod.GET, value = "/api/v1/application/logs/")
    public ResponseEntity<String> getLogs() throws IOException {
        String logs = new String(Files.readAllBytes(Paths.get(logFilePath)));
        return ResponseEntity.ok(logs);
    }
}
