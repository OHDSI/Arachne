package com.odysseusinc.arachne.datanode.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

import com.odysseusinc.arachne.TestContainersInitializer;
import com.odysseusinc.arachne.commons.types.DBMSType;
import com.odysseusinc.arachne.datanode.dto.datasource.WriteDataSourceDTO;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.KerberosAuthMechanism;
import java.util.Set;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.web.multipart.MultipartFile;

@SpringBootTest
@ActiveProfiles("test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@ContextConfiguration(initializers = TestContainersInitializer.class)
public class ValidatorTest {

    @Autowired
    private Validator validator;

    private MultipartFile mockKeyFile = new MockMultipartFile("keyfile.json", new byte[128]);

    @Test
    public void shouldValidateCreateDatasourceDTO() {

        // Should pass with keyfile
        WriteDataSourceDTO bqDataSourceDTO = prepareDataSourceDTO(DBMSType.BIGQUERY);
        Set<ConstraintViolation<WriteDataSourceDTO>> violations = validator.validate(bqDataSourceDTO);
        assertTrue(violations.isEmpty());

        // Should fail without username
        WriteDataSourceDTO pgDataSourceDTO = prepareDataSourceDTO(DBMSType.POSTGRESQL);
        violations = validator.validate(pgDataSourceDTO);
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("dbUsername")));

        // Should pass
        pgDataSourceDTO.setDbUsername("postgresql");
        violations = validator.validate(pgDataSourceDTO);
        assertTrue(violations.isEmpty());

        // Should fail without username not using kerberos
        WriteDataSourceDTO impalaDataSourceDTO = prepareDataSourceDTO(DBMSType.IMPALA);
        violations = validator.validate(impalaDataSourceDTO);
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("dbUsername")));

        // Should not fail with username not using kerberos
        impalaDataSourceDTO.setDbUsername("user");
        violations = validator.validate(impalaDataSourceDTO);
        assertTrue(violations.isEmpty());

        // Should pass with keyfile
        violations = validator.validate(impalaDataSourceDTO);
        assertTrue(violations.isEmpty());

        // Should fail without kerberos user during kerberos password auth
        impalaDataSourceDTO.setUseKerberos(true);
        impalaDataSourceDTO.setKrbUser(null);
        impalaDataSourceDTO.setKrbAuthMechanism(KerberosAuthMechanism.PASSWORD);
        violations = validator.validate(impalaDataSourceDTO);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("krbUser")));
    }

    @Test
    public void shouldValidateDataSource() {

        // Should fail without keyfile
        DataSource bqDataSource = prepareDataSource(DBMSType.BIGQUERY);
        Set<ConstraintViolation<DataSource>> violations = validator.validate(bqDataSource);
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("keyfile")));

        // Should pass with keyfile
        bqDataSource.setKeyfile(new byte[16]);
        violations = validator.validate(bqDataSource);
        assertTrue(violations.isEmpty());

        // Should fail without username
        DataSource pgDataSource = prepareDataSource(DBMSType.POSTGRESQL);
        violations = validator.validate(pgDataSource);
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")));

        // Should pass
        pgDataSource.setUsername("postgresql");
        violations = validator.validate(pgDataSource);
        assertTrue(violations.isEmpty());

        // Should fail without username not using kerberos
        DataSource impalaDataSource = prepareDataSource(DBMSType.IMPALA);
        violations = validator.validate(impalaDataSource);
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")));

        // Should not fail with username not using kerberos
        impalaDataSource.setUsername("user");
        violations = validator.validate(impalaDataSource);
        assertTrue(violations.isEmpty());

        // Should fail without keyfile using kerberos keytab auth
        impalaDataSource.setUsername(null);
        impalaDataSource.setUseKerberos(true);
        impalaDataSource.setKrbAuthMechanism(KerberosAuthMechanism.KEYTAB);
        violations = validator.validate(impalaDataSource);
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("keyfile")));

        // Should pass with keyfile
        impalaDataSource.setKeyfile(new byte[16]);
        violations = validator.validate(impalaDataSource);
        assertTrue(violations.isEmpty());

        // Should fail without kerberos user during kerberos password auth
        impalaDataSource.setKeyfile(null);
        impalaDataSource.setKrbAuthMechanism(KerberosAuthMechanism.PASSWORD);
        violations = validator.validate(impalaDataSource);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("krbUser")));
    }

    private WriteDataSourceDTO prepareDataSourceDTO(DBMSType type) {
        WriteDataSourceDTO dataSourceDTO = new WriteDataSourceDTO();
        dataSourceDTO.setDbmsType(type.getValue());
        dataSourceDTO.setName("testDataSource");
        dataSourceDTO.setConnectionString("jdbc:postgresql://localhost/datanode_test");
        dataSourceDTO.setCdmSchema("default");
        return dataSourceDTO;
    }

    private DataSource prepareDataSource(DBMSType type) {
        DataSource dataSource = new DataSource();
        dataSource.setType(type);
        dataSource.setName("testDataSource");
        dataSource.setConnectionString("jdbc:postgresql://localhost/datanode_test");
        dataSource.setCdmSchema("default");
        dataSource.setUseKerberos(false);
        return dataSource;
    }
}
