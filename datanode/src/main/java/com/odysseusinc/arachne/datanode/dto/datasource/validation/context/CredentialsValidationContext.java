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

package com.odysseusinc.arachne.datanode.dto.datasource.validation.context;

import com.odysseusinc.arachne.commons.types.DBMSType;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.KerberosAuthMechanism;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CredentialsValidationContext {

    private DBMSType type;
    private String username;
    private String usernameField;
    private String keyfileField;
    private boolean useKeyFile;
    private Object keyfile;
    private boolean useKerberos;
    private KerberosAuthMechanism kerberosAuthMechanism;
    private String kerberosUser;
    private String kerberosUserField;

    public CredentialsValidationContext(DBMSType type) {
        this.type = type;
    }

}
