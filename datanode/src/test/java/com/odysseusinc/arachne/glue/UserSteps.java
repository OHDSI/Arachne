/*
 * Copyright 2024 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.glue;

import com.odysseusinc.arachne.datanode.datasource.DataSourceService;
import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceDTO;
import com.odysseusinc.arachne.datanode.dto.datasource.WriteDataSourceDTO;
import com.odysseusinc.arachne.datanode.jpa.JpaConditional;
import com.odysseusinc.arachne.datanode.jpa.JpaSugar;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.model.user.User_;
import com.odysseusinc.arachne.datanode.service.impl.LegacyUserService;
import com.odysseusinc.arachne.datanode.util.Fn;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

public class UserSteps {

    @Autowired
    private World world;

    @Autowired
    private LegacyUserService userService;

    @Autowired
    private DataSourceService sourceService;


    @PersistenceContext
    private EntityManager em;

    @When("user {word} {word} exists")
    public User createUser(String firstName, String lastName) {

        User user = userService.create(Fn.create(User::new, u -> {
            u.setUsername(firstName);
            u.setLastName(lastName);
            u.setEmail(getEmail(firstName, lastName));
        }));
        world.capture(firstName + " " + lastName, user.getId());
        return user;
    }

    @When("User {string} creates datasource {string}")
    public void createDataSource(String userName, String name) {
        User user = find(em, userName);
        // Prepare input data
        WriteDataSourceDTO dataSourceDTO = new WriteDataSourceDTO();
        dataSourceDTO.setName(name);
        dataSourceDTO.setDescription("This is a demo data source.");
        dataSourceDTO.setDbmsType("POSTGRESQL");
        dataSourceDTO.setConnectionString("jdbc:postgresql://localhost:5432/demo");
        dataSourceDTO.setCdmSchema("cdm_schema");
        dataSourceDTO.setDbUsername("user");
        dataSourceDTO.setDbPassword("password");

        DataSourceDTO dataSourceDTO1 = sourceService.create(dataSourceDTO, user, null);
        world.capture(name, dataSourceDTO1.getId());
    }


    public static String getEmail(String firstName, String lastName) {
        return firstName.toLowerCase() + "." + lastName.toLowerCase() + "@arachne.com";
    }

    public static User find(EntityManager em, String name) {
        String[] names = name.split(" ");
        String email = getEmail(names[0], names[1]);
        return JpaSugar.select(em, User.class).where(
                JpaConditional.has(User_.email, email)
        ).getSingleResult();
    }
}
