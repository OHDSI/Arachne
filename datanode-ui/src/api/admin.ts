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

import { api } from ".";
import {UserDTOInterface, UserDTOSearchInterface} from "../libs/types";

export const getUsers = (): Promise<UserDTOSearchInterface[]> =>
  api.get("/admin/admins");

export const searchUsers = (query: string): Promise<UserDTOSearchInterface[]> =>
  api.get(`/admin/admins/suggest?query=${query}`);

export const addUser = (id: string): Promise<UserDTOSearchInterface> =>
  api.post(`/admin/admins/${id}`);

export const removeUser = (id: string): Promise<null> =>
  api.delete(`/admin/admins/${id}`);

export const systemSettings = (): Promise<any> => api.get("/admin/system-settings");

export const updateSystemSettings = (value): Promise<any> => api.post("/admin/system-settings", value);

export const getApplicationLog = (): Promise<string> => api.get(`/application/logs/`);