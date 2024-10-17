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

import com.odysseusinc.arachne.datanode.exception.AuthException;
import com.odysseusinc.arachne.datanode.exception.BadRequestException;
import com.odysseusinc.arachne.datanode.exception.ResourceConflictException;
import com.odysseusinc.arachne.datanode.exception.ServiceNotAvailableException;
import com.odysseusinc.arachne.datanode.exception.ValidationException;
import com.odysseusinc.arachne.datanode.service.UserService;
import com.odysseusinc.arachne.nohandlerfoundexception.NoHandlerFoundExceptionUtils;
import lombok.extern.slf4j.Slf4j;
import org.ohdsi.authenticator.exception.AuthenticationException;
import org.ohdsi.authenticator.exception.BadCredentialsAuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.async.AsyncRequestTimeoutException;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class ExceptionHandlingAdvice {

    @Autowired
    protected UserService userService;
    @Value("${datanode.app.errorsTokenEnabled}")
    private boolean errorsTokenEnabled;

    @Autowired
    private NoHandlerFoundExceptionUtils noHandlerFoundExceptionUtils;

    @ExceptionHandler(AsyncRequestTimeoutException.class)
    public ResponseEntity<String> exceptionHandler(HttpServletRequest request, AsyncRequestTimeoutException e) {
        // Log only message, not getting a meaningful stacktrace here (only Spring classes)
        log.warn("Timed out waiting for response on [{}]: {}", request.getRequestURI(), e.getMessage());
        return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).build();
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exceptionHandler(Exception ex) {
        String token = token();
        log.error("[{}]: {}", token, ex.getMessage(), ex);
        return ResponseEntity.internalServerError().body("Error code [" + token + "]. Please provide this code to contact system administrator");
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<?> exceptionHandler(BindException ex) {
        Map<String, Object> errors = ex.getBindingResult().getFieldErrors().stream().collect(
                Collectors.toMap(FieldError::getField, ExceptionHandlingAdvice::fieldMessage)
        );
        return validationError(ex.getMessage(), errors);
    }

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<String> exceptionHandler(AuthException ex) {
        return unauthorized(ex);
    }

    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<String> exceptionHandler(org.springframework.security.core.AuthenticationException ex) {
        return unauthorized(ex);
    }

    @ExceptionHandler(BadCredentialsAuthenticationException.class)
    public ResponseEntity<String> exceptionHandler(BadCredentialsAuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message(ex));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> exceptionHandler(AuthenticationException ex) {
        return unauthorized(ex);
    }

    public ResponseEntity<String> unauthorized(Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message(e));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<?> exceptionHandler(ValidationException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<?> validationHandler(ResourceConflictException e) {
        return validationError(e.getMessage(), e.getErrors());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> badRequestHandler(BadRequestException e) {
        return ResponseEntity.badRequest().body(message(e));
    }

    @ExceptionHandler(ServiceNotAvailableException.class)
    public ResponseEntity<?> serviceNotAvailableHanlder() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
    }

    @ExceptionHandler({NoHandlerFoundException.class})
    public void handleNotFoundError(HttpServletRequest request, HttpServletResponse response) throws Exception {
        noHandlerFoundExceptionUtils.handleNotFoundError(request, response);
    }

    private String message(Exception e) {
        String message = e.getMessage();
        if (errorsTokenEnabled) {
            String token = token();
            log.error("[{}]. error-token: {}", token, message, e);
            return "Error code [" + token + "]. Please provide this code to contact system administrator";
        } else {
            log.error(message, e);
            return message;
        }
    }

    private static ResponseEntity<ValidationErrors> validationError(String message, Map<String, Object> errors) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ValidationErrors.of(message, errors));
    }

    private static String fieldMessage(FieldError field) {
        return Optional.ofNullable(field.getDefaultMessage()).orElseGet(() -> "Rejected value: [" + field.getRejectedValue() + "]");
    }

    private static String token() {
        return UUID.randomUUID().toString();
    }

}
