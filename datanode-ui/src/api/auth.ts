import { api } from './';

export const login = (userName: string, password: string): Promise<void> =>
    api.post('/auth/login', { username: userName, password });

export const getUser: any = (): Promise<any> => api.get('/auth/me');

export const logout: any = (): Promise<void> => api.post('/auth/logout');

// qaadmin@arachnenetwork.com
// {"username":"qaadmin@arachnenetwork.com","password":"FKkGY8wx28xy9d"}