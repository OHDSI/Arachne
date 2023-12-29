/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.service.client.decoders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult;
import com.odysseusinc.arachne.datanode.exception.ArachneSystemRuntimeException;
import com.odysseusinc.arachne.datanode.exception.AuthException;
import com.odysseusinc.arachne.datanode.exception.ValidationException;
import feign.Response;
import feign.codec.ErrorDecoder;
import java.io.IOException;

public class ErrorResultDecoder implements ErrorDecoder {
    @Override
    public Exception decode(String methodKey, Response response) {

        if (response.status() == 200 && response.body().length() > 0) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonResult result = mapper.readValue(response.body().asReader(), JsonResult.class);
                switch (result.getErrorCode()) {
                    case 3: //ValidationError
                        throw new ValidationException(response.reason());
                    case 2: //Not authorized
                        throw new AuthException(response.reason());
                    default: //System runtime
                        throw new ArachneSystemRuntimeException(response.reason());
                }
            }catch (IOException ignored){
            }
        }
        return null;
    }
}
