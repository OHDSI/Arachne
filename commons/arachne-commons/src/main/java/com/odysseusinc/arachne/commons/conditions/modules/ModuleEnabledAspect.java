package com.odysseusinc.arachne.commons.conditions.modules;

import com.odysseusinc.arachne.commons.config.ArachneConfiguration;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ModuleEnabledAspect {
    private final ArachneConfiguration arachneConfiguration;

    public ModuleEnabledAspect(ArachneConfiguration arachneConfiguration) {
        this.arachneConfiguration = arachneConfiguration;
    }

    @Around("@within(moduleEnabled)")
    public Object checkClassEnabled(ProceedingJoinPoint joinPoint, ModuleEnabled moduleEnabled) throws Throwable {
        return checkModuleEnabled(joinPoint, moduleEnabled);
    }

    @Around("@annotation(moduleEnabled)")
    public Object checkMethodEnabled(ProceedingJoinPoint joinPoint, ModuleEnabled moduleEnabled) throws Throwable {
        return checkModuleEnabled(joinPoint, moduleEnabled);
    }

    private Object checkModuleEnabled(ProceedingJoinPoint joinPoint, ModuleEnabled moduleEnabled) throws Throwable {
        if (arachneConfiguration.isModuleDisabled(moduleEnabled.value())) {
            throw new ModuleAccessException(moduleEnabled.value());
        }
        return joinPoint.proceed();
    }
}
