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
public class Analysis {
    private String title;
    private Map<String, String> predefinedFailures = new HashMap<>();
    private long executionDelay;
    private List<Progress> execution = new ArrayList<>();

    private Long id;
    private String stage;
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