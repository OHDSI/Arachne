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

export enum EntityActions {
  GET_ENTITY = "GET_ENTITY",
  GET_ENTITY_SUCCESS = "GET_ENTITY_SUCCESS",
  GET_ENTITY_ERROR = "GET_ENTITY_ERROR",

  DELETE_ENTITY = "DELETE_ENTITY",
  DELETE_ENTITY_SUCCESS = "DELETE_ENTITY_SUCCESS",
  DELETE_ENTITY_ERROR = "DELETE_ENTITY_ERROR",

  UPDATE_ENTITY = "UPDATE_ENTITY",
  UPDATE_ENTITY_SUCCESS = "UPDATE_ENTITY_SUCCESS",
  UPDATE_ENTITY_ERROR = "UPDATE_ENTITY_ERROR",

  SET_VERSION = "SET_VERSION",
  REVERT_VERSION = "REVERT_VERSION",

  COPY_ENTITY = "COPY_ENTITY",
  COPY_ENTITY_SUCCESS = "COPY_ENTITY_SICCESS",
  COPY_ENTITY_ERROR = "COPY_ENTITY_ERROR",
}