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

package com.odysseusinc.arachne.datanode.controller;

import com.odysseusinc.arachne.datanode.dto.datanode.DataNodeModeDTO;
import com.odysseusinc.arachne.datanode.model.datanode.FunctionalMode;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DataNodeController {

    @RequestMapping(method = RequestMethod.GET, value = "/api/v1/datanode/mode")
    public DataNodeModeDTO getDataNodeMode() {
        DataNodeModeDTO dto = new DataNodeModeDTO();
        dto.setMode(FunctionalMode.STANDALONE);
        return dto;
    }
}
