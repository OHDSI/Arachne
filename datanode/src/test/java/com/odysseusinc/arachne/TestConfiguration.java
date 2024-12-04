package com.odysseusinc.arachne;


import com.odysseusinc.arachne.datanode.service.client.engine.ExecutionEngineClient;
import com.odysseusinc.arachne.ee.ExecutionEngine;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;


@Configuration
@SpringBootConfiguration
@EnableAutoConfiguration
@Profile("test")
@ComponentScan(
        basePackageClasses = TestConfiguration.class
)
public class TestConfiguration {

    @Primary
    @Bean
    public ExecutionEngineClient executionEngineClient(ExecutionEngine executionEngine) {
        return new StubExecutionEngineClient(executionEngine);
    }
}
