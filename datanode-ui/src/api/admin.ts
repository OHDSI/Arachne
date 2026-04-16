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
import { PasswordPolicy } from "./auth";

export const getApplicationLog = (range?: string): Promise<string> => {
  const headers = range ? { Range: range } : {};
  return api
    .get("/application/logs/", { headers, responseType: "text" })
    .then((res) => (typeof res === "string" ? res : (res as any)?.data ?? ""));
};

export const systemSettings = (): Promise<{ list: any[]; applied?: boolean }> =>
  api.get("/admin/system-settings");

export const updateSystemSettings = (body: {
  values: Record<string, unknown>;
}): Promise<void> => api.post("/admin/system-settings", body);

// User management
export interface AdminUserDTO {
  id: number;
  username: string;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  roles: string[];
  enabled: boolean | null;
}

export interface AuthSettingsDTO {
  selfRegistrationEnabled: boolean;
  passwordPolicy: PasswordPolicy;
}

export const getUsers = (): Promise<AdminUserDTO[]> =>
  api.get("/admin/users");

export const getAdminUser = (id: number): Promise<AdminUserDTO> =>
  api.get(`/admin/users/${id}`);

export const updateUserRoles = (id: number, roles: string[]): Promise<AdminUserDTO> =>
  api.put(`/admin/users/${id}/roles`, { roles });

export const enableUser = (id: number): Promise<AdminUserDTO> =>
  api.put(`/admin/users/${id}/enable`);

export const disableUser = (id: number): Promise<AdminUserDTO> =>
  api.put(`/admin/users/${id}/disable`);

export const createAdminUser = (username: string, password: string, roles: string[]): Promise<AdminUserDTO> =>
  api.post("/admin/users", { username, password, roles });

export const deleteUser = (id: number): Promise<void> =>
  api.delete(`/admin/users/${id}`);

export const getAuthSettings = (): Promise<AuthSettingsDTO> =>
  api.get("/admin/auth-settings");

export const updateAuthSettings = (settings: AuthSettingsDTO): Promise<AuthSettingsDTO> =>
  api.put("/admin/auth-settings", settings);
