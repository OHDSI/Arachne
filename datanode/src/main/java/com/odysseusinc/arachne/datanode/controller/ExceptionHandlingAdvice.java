/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexandr Ryabokon, Vitaly Koulakov, Anton Gackovka, Maria Pozhidaeva, Mikhail Mironov
 * Created: November 18, 2016
 *
 */

package com.odysseusinc.arachne.datanode.controller;

import static com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult.ErrorCode.SYSTEM_ERROR;
import static com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult.ErrorCode.UNAUTHORIZED;
import static com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult.ErrorCode.VALIDATION_ERROR;

import com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult;
import com.odysseusinc.arachne.datanode.exception.AuthException;
import com.odysseusinc.arachne.datanode.exception.IllegalOperationException;
import com.odysseusinc.arachne.datanode.exception.IntegrationValidationException;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.ValidationException;
import com.odysseusinc.arachne.datanode.service.UserService;
import java.io.IOException;
import java.sql.SQLException;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHandlingAdvice extends BaseController {

    private static final String ERROR_MESSAGE = "Please contact system administrator and provide this error token: %s";
    private static final Logger LOGGER = LoggerFactory.getLogger(ExceptionHandlingAdvice.class);
    @Value("${datanode.app.errorsTokenEnabled}")
    private boolean errorsTokenEnabled;

    public ExceptionHandlingAdvice(UserService userService) {

        super(userService);
    }


    @ExceptionHandler({SQLException.class, DataAccessException.class})
    public ResponseEntity handleDataAccessExceptions(Exception ex) {

        LOGGER.error(ex.getMessage(), ex);
        JsonResult result = new JsonResult<>(SYSTEM_ERROR);
        result.setErrorMessage(ex.getMessage());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<JsonResult> exceptionHandler(Exception ex) {

        LOGGER.error(ex.getMessage(), ex);
        JsonResult result = new JsonResult<>(SYSTEM_ERROR);
        result.setErrorMessage(ex.getMessage());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<JsonResult> exceptionHandler(MethodArgumentNotValidException ex) {

        LOGGER.error(ex.getMessage(), ex);
        JsonResult result = new JsonResult<>(VALIDATION_ERROR);
        if (ex.getBindingResult().hasErrors()) {
            result = setValidationErrors(ex.getBindingResult());
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<JsonResult> exceptionHandler(IOException ex) {

        LOGGER.error(ex.getMessage(), ex);
        JsonResult result = new JsonResult<>(SYSTEM_ERROR);
        result.setErrorMessage(ex.getMessage());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<JsonResult> exceptionHandler(AuthException ex) {

        LOGGER.error(ex.getMessage(), ex);
        JsonResult result = new JsonResult<>(UNAUTHORIZED);
        result.setErrorMessage(ex.getMessage());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    private ResponseEntity getErrorResponse(HttpStatus status, Exception ex) {

        if (errorsTokenEnabled) {
            String errorToken = generateErrorToken();
            //process error context staff
            //fill me
            // end process error context staff
            LOGGER.error("Server error : " + errorToken, ex);
            return new ResponseEntity(generateExceptionMessage(errorToken), status);
        }

        LOGGER.error("Server error ", ex);
        return new ResponseEntity(ex.getMessage(), status);
    }

    @ExceptionHandler(IntegrationValidationException.class)
    public ResponseEntity<JsonResult> exceptionHandler(IntegrationValidationException ex) throws IOException {

        LOGGER.error(ex.getMessage(), ex);
        return new ResponseEntity<>(ex.getJsonResult(), HttpStatus.OK);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<JsonResult> exceptionHandler(ValidationException ex) throws IOException {

        LOGGER.error(ex.getMessage(), ex);
        JsonResult result = new JsonResult<>(VALIDATION_ERROR);
        result.setErrorMessage(ex.getMessage());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ExceptionHandler(NotExistException.class)
    public ResponseEntity<JsonResult> exceptionHandler(NotExistException ex) {
        LOGGER.error(ex.getMessage());
        JsonResult result = new JsonResult<>(SYSTEM_ERROR);
        result.setErrorMessage(ex.getMessage());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ExceptionHandler(IllegalOperationException.class)
    public ResponseEntity<JsonResult> exceptionHandler(IllegalOperationException ex) {

        LOGGER.error(ex.getMessage());
        final JsonResult result = new JsonResult(SYSTEM_ERROR);
        result.setErrorMessage(ex.getMessage());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    private String generateErrorToken() {

        return UUID.randomUUID().toString();
    }

    private String generateExceptionMessage(String token) {

        return String.format(ERROR_MESSAGE, token);
    }
}