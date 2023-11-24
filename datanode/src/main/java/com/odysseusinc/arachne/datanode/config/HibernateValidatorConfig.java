package com.odysseusinc.arachne.datanode.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Configuration;

import javax.validation.ValidatorFactory;
import java.util.Map;

@Configuration
public class HibernateValidatorConfig implements HibernatePropertiesCustomizer {

    @Autowired
    private ValidatorFactory validatorFactory;

    @Override
    public void customize(Map<String, Object> hibernateProperties) {
        hibernateProperties.put("javax.persistence.validation.factory", validatorFactory);
    }
}
