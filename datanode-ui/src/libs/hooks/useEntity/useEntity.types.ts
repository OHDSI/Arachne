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