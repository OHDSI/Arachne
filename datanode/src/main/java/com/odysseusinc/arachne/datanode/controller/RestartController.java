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
package com.odysseusinc.arachne.datanode.controller;

import com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult;
import com.odysseusinc.arachne.datanode.WebApplicationStarter;
import io.swagger.annotations.Api;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Api(hidden = true)
@RestController
@Secured("ROLE_ADMIN")
public class RestartController {

    @RequestMapping(value = "/api/v1/admin/restart", method = RequestMethod.POST)
    public JsonResult<?> restart() {
        Thread restartThread = new Thread(WebApplicationStarter::restart);
        restartThread.setDaemon(false);
        restartThread.start();
        return new JsonResult<>(JsonResult.ErrorCode.NO_ERROR);
    }

}
