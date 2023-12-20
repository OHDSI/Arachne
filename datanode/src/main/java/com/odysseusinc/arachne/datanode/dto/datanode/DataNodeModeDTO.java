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

package com.odysseusinc.arachne.datanode.dto.datanode;

import com.odysseusinc.arachne.datanode.model.datanode.FunctionalMode;

public class DataNodeModeDTO {

    private FunctionalMode mode;

    public DataNodeModeDTO() {

    }

    public DataNodeModeDTO(FunctionalMode mode) {

        this.mode = mode;
    }

    public FunctionalMode getMode() {

        return mode;
    }

    public void setMode(FunctionalMode mode) {

        this.mode = mode;
    }
}
