/*
 *
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
 *
 */

import axios, { AxiosError, AxiosResponse } from "axios";

const tempParserInconsistentResponce = (res: any) => {
  return res.data.content;
};

const errorParser = (res, errorCode) => {
  switch (errorCode) {
  case 1:
    return {
      status: 401,
      statusText: "UNAUTHORIZED",
      message: res?.data?.errorMessage
    };
  case 2:
    return {
      status: 403,
      statusText: "PERMISSION_DENIED",
      message: res?.errorMessage
    };
  case 3:
    return {
      status: 400,
      statusText: "VALIDATION_ERROR",
      message: res?.data?.errorMessage
    };
  case 4:
    return {
      status: 500,
      statusText: "SYSTEM_ERROR",
      message: res?.errorMessage
    };
  case 5:
    return {
      status: 409,
      statusText: "ALREADY_EXIST",
      message: res?.errorMessage
    };
  case 6:
    return {
      status: 424,
      statusText: "DEPENDENCY_EXISTS"
    };
  case 7:
    return {
      status: 417,
      statusText: "UNACTIVATED"
    };
  }
};

const successResponse = (res: AxiosResponse) => {

  if (tempParserInconsistentResponce(res)) return res.data;

  const errorCode = res.data.errorCode;

  if (!errorCode) return res.data.result || res.data;

  return Promise.reject(errorParser(res, errorCode));

};
const errorResponse = (error: AxiosError) => {
  return Promise.reject(error);
};

const unauthorizeUser = (error: any, store: any) => {
  const { status } = error?.response || {};
  if (status === 401) store.dispatch({ type: "USER_GET_REQUEST_FAILED" });
};

const instance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

instance.interceptors.response.use(successResponse, errorResponse);

export const api = instance;

export const setupInterceptors = (store: any) => {
  instance.interceptors.response.use(
    response => response,
    error => {
      unauthorizeUser(error, store);
      throw error;
    }
  );
};
