import { api } from ".";
import { UserDTOSearchInterface } from "../libs/types";

export const getUsers = (): Promise<UserDTOSearchInterface[]> =>
  api.get('/admin/admins');

export const searchUsers = (query: string): Promise<UserDTOSearchInterface[]> =>
  api.get(`/admin/admins/suggest?query=${query}`)

export const addUser = (id: string): Promise<UserDTOSearchInterface> =>
  api.post(`/admin/admins/${id}`)

export const removeUser = (id: string): Promise<null> =>
  api.delete(`/admin/admins/${id}`)