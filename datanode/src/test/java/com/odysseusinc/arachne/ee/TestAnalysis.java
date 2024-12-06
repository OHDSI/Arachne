package com.odysseusinc.arachne.ee;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class TestAnalysis {
    private String title;
    private Map<String, String> predefinedFailures = new HashMap<>();
    private List<Progress> execution = new ArrayList<>();
    private boolean exceptionRun;
    private boolean exceptionAbort;
    private boolean exceptionFind;

    private Long id;
    private volatile String stage;
    private String error;
    private String password;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Progress {
        private String stdout;
        private String error;
    }
}