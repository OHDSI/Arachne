import { BaseResponceInterface, UserDTOSearchInterface } from "../libs/types";
import { api } from ".";

export const getUsers: any = () => api.get('/admin/admins');
export const searchUsers = (query: string): Promise<UserDTOSearchInterface[]> => api.get(`/admin/admins/suggest?query=${query}`)

export const addUser = (id: string): Promise<UserDTOSearchInterface> => api.post(`/admin/admins/${id}`)

export const removeUser = (id: string): Promise<null> => api.delete(`/admin/admins/${id}`)