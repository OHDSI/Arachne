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
import { UserDTOInterface } from "../libs/types";
import { AuthProviders } from "../libs/types";

export const login = (username: string, password: string): Promise<{ token: string }> =>
  api.post("/auth/login", { username, password });

export const getUser = (): Promise<UserDTOInterface> =>
  api.get("/auth/me");

export const logout = (): Promise<boolean> =>
  api.post("/auth/logout");

export const getAuthOptions = (): Promise<AuthProviders> =>
    api.get('/auth/providers');

export interface AuthModeResponse {
  mode: "LOCAL" | "OIDC";
  selfRegistrationEnabled: boolean;
}

export interface SetupStatusResponse {
  initialized: boolean;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSpecialChar: boolean;
}

export const getAuthMode = (): Promise<AuthModeResponse> =>
  api.get("/auth/mode");

export const getSetupStatus = (): Promise<SetupStatusResponse> =>
  api.get("/auth/setup-status");

export const postSetup = (username: string, password: string): Promise<any> =>
  api.post("/auth/setup", { username, password });

export const register = (username: string, password: string): Promise<any> =>
  api.post("/auth/register", { username, password });

export const getPasswordPolicy = (): Promise<PasswordPolicy> =>
  api.get("/auth/password-policy");
