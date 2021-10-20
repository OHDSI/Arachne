package com.odysseusinc.arachne.commons.conditions.modules;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ModuleAccessException extends RuntimeException {
    private String module;

    public ModuleAccessException(String module) {
        this.module = module;
    }

    @Override
    public String getMessage() {
        return String.format("Module %s is disabled", this.module);
    }
}
