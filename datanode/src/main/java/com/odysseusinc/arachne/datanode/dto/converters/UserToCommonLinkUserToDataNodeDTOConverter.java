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

package com.odysseusinc.arachne.datanode.dto.converters;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataNodeUserRole;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonLinkUserToDataNodeDTO;
import com.odysseusinc.arachne.datanode.model.user.User;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserToCommonLinkUserToDataNodeDTOConverter implements Converter<User, CommonLinkUserToDataNodeDTO> {

    @Override
    public CommonLinkUserToDataNodeDTO convert(User user) {

        final CommonLinkUserToDataNodeDTO commonLinkUserToDataNode = new CommonLinkUserToDataNodeDTO();
        commonLinkUserToDataNode.setUserName(user.getUsername());
        commonLinkUserToDataNode.setEnabled(user.getEnabled());
        final Set<CommonDataNodeUserRole> roles = user.getRoles()
                .stream()
                .map(role -> {
                    final CommonDataNodeUserRole commonDataNodeUserRole = new CommonDataNodeUserRole();
                    commonDataNodeUserRole.setName(role.getName());
                    return commonDataNodeUserRole;
                })
                .collect(Collectors.toSet());
        commonLinkUserToDataNode.setRoles(roles);
        return commonLinkUserToDataNode;
    }
}
