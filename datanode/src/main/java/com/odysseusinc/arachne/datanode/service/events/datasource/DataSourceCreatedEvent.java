/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.service.events.datasource;

import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.model.user.User;

public class DataSourceCreatedEvent extends BaseDataSourceEvent {

    /**
     * Create a new ApplicationEvent.
     *  @param source the object on which the event initially occurred (never {@code null})
     * @param owner
     * @param dataSource
     */
    public DataSourceCreatedEvent(Object source, User owner, DataSource dataSource) {

        super(source, owner, dataSource);
    }

}
