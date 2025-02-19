/*
 * Copyright 2018, 2025 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.controller.auth;

import com.odysseusinc.arachne.datanode.auth.OAuthClientProperties;
import com.odysseusinc.arachne.datanode.util.Fn;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/api/v1/auth/providers")
public class OAuthProviderController {

    @Autowired
    private OAuthClientProperties properties;

    @GetMapping
    public Map<String, ProviderDto> getProviders() {
        return properties.getProvider().entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, e -> Fn.create(ProviderDto::new, p -> Optional.ofNullable(e.getValue()).ifPresent(v -> {
            p.setText(v.getText());
            p.setImage(v.getImage());
        }))));
    }

    @Getter
    @Setter
    public static class ProviderDto {
        private String text;
        private String image;
    }
}
