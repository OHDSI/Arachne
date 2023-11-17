import { api } from ".";

export const getUsers: any = () => api.get('/admin/admins');
export const searchUsers: any = (query: string) => api.get(`/admin/admins/suggest?query=${query}`)

export const addUser = (id: string) => api.post(`/admin/admins/${id}`)

export const removeUser = (id: string) => api.delete(`/admin/admins/${id}`)