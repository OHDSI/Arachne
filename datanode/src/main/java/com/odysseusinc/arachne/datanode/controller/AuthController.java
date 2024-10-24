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

package com.odysseusinc.arachne.datanode.controller;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonAuthenticationModeDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAuthenticationRequest;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAuthenticationResponse;
import com.odysseusinc.arachne.datanode.dto.user.UserInfoDTO;
import com.odysseusinc.arachne.datanode.exception.AuthException;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.UserRegistrationStrategy;
import com.odysseusinc.arachne.datanode.service.UserService;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.ohdsi.authenticator.model.UserInfo;
import org.ohdsi.authenticator.service.authentication.AccessTokenResolver;
import org.ohdsi.authenticator.service.authentication.AuthenticationMode;
import org.pac4j.core.credentials.UsernamePasswordCredentials;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.security.Principal;
import java.util.Optional;

import static io.netty.handler.codec.http.cookie.CookieHeaderNames.SameSite;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class AuthController {
    protected Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private Authenticator authenticator;

    @Autowired
    private UserRegistrationStrategy userRegisterStrategy;

    @Autowired
    private AccessTokenResolver accessTokenResolver;

    @Value("${security.method}")
    private String authMethod;

    @Value("${security.authentication.mode:" + AuthenticationMode.Const.STANDARD + "}")
    private AuthenticationMode authenticationMode = AuthenticationMode.STANDARD;


    @ApiOperation("Get authentication mode")
    @RequestMapping(value = "/api/v1/auth/mode", method = GET)
    @Deprecated
    public CommonAuthenticationModeDTO authenticationMode() {

        return new CommonAuthenticationModeDTO(authenticationMode.getValue());
    }

    @ApiOperation(value = "Sign in user. Returns JWT token.")
    @RequestMapping(value = "${api.loginEnteryPoint}", method = RequestMethod.POST)
    public ResponseEntity<?> login(
            @Valid @RequestBody CommonAuthenticationRequest request) {

        UserInfo userInfo = authenticator.authenticate(
                authMethod,
                new UsernamePasswordCredentials(request.getUsername(), request.getPassword())
        );
        User centralUser = UserService.toEntity(userInfo);
        userRegisterStrategy.registerUser(centralUser);

        return Optional.ofNullable(userInfo).map(UserInfo::getToken).<ResponseEntity<?>>map(token ->
                ok(new CommonAuthenticationResponse(token), authCookie(token, -1))
        ).orElseGet(() ->
                unauthorized("Cannot refresh token user info is either null or does not contain token")
        );
    }

    @ApiOperation("Refresh session token.")
    @RequestMapping(value = "/api/v1/auth/refresh", method = RequestMethod.POST)
    public ResponseEntity<?> refresh(HttpServletRequest request) {

        String accessToken = request.getHeader(accessTokenResolver.getTokenHeaderName());
        UserInfo userInfo = authenticator.refreshToken(accessToken);
        return userService.findByUsername(userInfo.getUsername()).<ResponseEntity<?>>map(user ->
                ok(userInfo.getToken(), authCookie(userInfo.getToken(), -1))
        ).orElseGet(() ->
                unauthorized("User is not registered")
        );
    }

    @ApiOperation("Get current principal")
    @RequestMapping(value = "/api/v1/auth/me", method = GET)
    public UserInfoDTO principal(Principal principal) {
        String name = principal.getName();
        return userService
                .findByUsername(name)
                .map(user -> {
                    UserInfoDTO userInfoDTO = new UserInfoDTO();
                    userInfoDTO.setUsername(user.getUsername());
                    final boolean isAdmin = user.getRoles().stream()
                            .anyMatch(r -> r.getName().equals("ROLE_ADMIN"));
                    userInfoDTO.setIsAdmin(isAdmin);
                    userInfoDTO.setFirstname(user.getFirstName());
                    userInfoDTO.setLastname(user.getLastName());
                    return userInfoDTO;
                }).orElseThrow(() -> new AuthException("User not found: [" + name + "]"));
    }

    @ApiOperation("Logout")
    @RequestMapping(value = "/api/v1/auth/logout", method = RequestMethod.POST)
    public ResponseEntity<?> logout(HttpServletRequest request) {

        try {
            String accessToken = request.getHeader(accessTokenResolver.getTokenHeaderName());
            if (StringUtils.isNotEmpty(accessToken)) {
                authenticator.invalidateToken(accessToken);
            }
            return ok(true, authCookie("", 0));
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return ResponseEntity.internalServerError().body(ex.getMessage());
        }
    }

    private <T> ResponseEntity<?> ok(T body, String s) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, s)
                .body(body);
    }

    private ResponseEntity<?> unauthorized(String errorMessage) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.SET_COOKIE, authCookie("", 0))
                .body(errorMessage);
    }

    private String authCookie(String token, int expiry) {
        return authCookie(token, expiry, accessTokenResolver);
    }

    public static String authCookie(String token, int expiry, AccessTokenResolver accessTokenResolver) {
        return ResponseCookie.from(accessTokenResolver.getTokenHeaderName(), token)
                .path("/")
                .httpOnly(true)
                .secure(true)
                .sameSite(SameSite.Strict.name())
                .maxAge(expiry)
                .build().toString();
    }

}
