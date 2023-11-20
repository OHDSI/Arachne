import { Status } from "../../enums";

export interface EntityState<T, E = any> {
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
  updateEntity: (data: T) => Promise<void>;
  setVersionEntity: (data: T) => void;
  copyEntity: (data: T) => Promise<T>;
  revertEntity: () => void;
}
export interface EntityMethods<T> {
  get: (id?: string) => Promise<T>;
  delete?: (id: string) => Promise<void>;
  update: (data: T, id?: string) => Promise<T>;
  copy?: (id: string, name: string) => Promise<T>;
}