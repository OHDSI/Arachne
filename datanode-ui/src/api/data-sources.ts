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

import { api } from "./";
import { DBMSTypesInterface, DataSourceDTOInterface } from "../libs/types";

export const getDataSources = (): Promise<DataSourceDTOInterface[]> =>
  api.get("/data-sources");

export const getDataSource = (id: string): Promise<DataSourceDTOInterface> =>
  api.get(`/data-sources/${id}`);

export const removeDataSource = (id: string): Promise<boolean> =>
  api.delete(`/data-sources/${id}`);

export const createDataSource = (data): Promise<DataSourceDTOInterface> =>
  api.post("/data-sources", data);

export const updateDataSource = (data, id): Promise<DataSourceDTOInterface> =>
  api.put(`/data-sources/${id}`, data);

export const getDbmsTypes = (): Promise<DBMSTypesInterface[]> =>
  api.get("/data-sources/dbms-types");