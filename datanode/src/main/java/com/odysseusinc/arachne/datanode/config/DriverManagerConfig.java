/*******************************************************************************
 * Copyright 2023 Odysseus Data Services, Inc.
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
 *******************************************************************************/
package com.odysseusinc.arachne.datanode.config;

import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import javax.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DriverManagerConfig {

    @PostConstruct
    public void driverManagerRedshiftWorkaround() {

        java.util.Enumeration<Driver> drivers =  DriverManager.getDrivers();
        while (drivers.hasMoreElements()) {
            Driver d = drivers.nextElement();
            if (d.getClass().getName().equals("com.amazon.redshift.jdbc.Driver")) {
                try {
                    DriverManager.deregisterDriver(d);
                    DriverManager.registerDriver(d);
                } catch (SQLException e) {
                    throw new RuntimeException("Could not deregister redshift driver");
                }
                break;
            }
        }
    }

}
