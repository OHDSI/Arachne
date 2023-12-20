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

import { Status } from "../../enums";

export interface EntityState<T = any, E = any> {
  entity: T;
  version: T;
  draft: T;
  isVersionMode: boolean;
  status: Status;
  error: E;
}
export interface EntityHook<T> extends EntityState<T> {
  getEntity: () => Promise<void>;
  deleteEntity: () => Promise<void>;
  updateEntity: (data: any) => Promise<void>;
}

export interface MethodsUseEntityInterface<T> {
  get: (id: string) => Promise<T>;
  delete: (id: string) => Promise<boolean>;
  update: (entity: T, id: string) => Promise<T>;
}