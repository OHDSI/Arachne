/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: January 13, 2017
 *
 */

package com.odysseusinc.arachne.commons.api.v1.dto.util;


import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class JsonResult<T> implements Serializable {
    public enum ErrorCode {
        NO_ERROR(0),
        UNAUTHORIZED(1),
        PERMISSION_DENIED(2),
        VALIDATION_ERROR(3),
        SYSTEM_ERROR(4),
        ALREADY_EXIST(5),
        DEPENDENCY_EXISTS(6),
        UNACTIVATED(7);
        private Integer code;

        ErrorCode(Integer code) {

            this.code = code;
        }

        @Override
        public String toString() {

            return code.toString();
        }

        public Integer getCode() {

            return code;
        }

        public void setCode(Integer code) {

            this.code = code;
        }

        public boolean hasEqualCode(JsonResult jsonResult) {

            return jsonResult != null && Objects.equals(this.code, jsonResult.getErrorCode());
        }

    }

    public JsonResult() {

    }

    public JsonResult(ErrorCode errorCode) {

        this.errorCode = errorCode.getCode();
    }

    public JsonResult(ErrorCode errorCode, T result) {

        this.result = result;
        this.errorCode = errorCode.getCode();
    }

    private T result;
    private String errorMessage;
    private Integer errorCode;
    private Map<String, Object> validatorErrors = new HashMap<>();


    public T getResult() {

        return result;
    }

    public void setResult(T result) {

        this.result = result;
    }

    public String getErrorMessage() {

        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {

        this.errorMessage = errorMessage;
    }

    public Integer getErrorCode() {

        return errorCode;
    }

    public void setErrorCode(Integer errorCode) {

        this.errorCode = errorCode;
    }

    public Map<String, Object> getValidatorErrors() {

        return validatorErrors;
    }

    public void setValidatorErrors(Map<String, Object> validatorErrors) {

        this.validatorErrors = validatorErrors;
    }
}