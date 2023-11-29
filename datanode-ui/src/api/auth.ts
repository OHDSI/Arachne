import { api } from './';
import { UserDTOInterface } from '../libs/types';

export const login = (username: string, password: string): Promise<{ token: string }> =>
  api.post('/auth/login', { username, password });

export const getUser = (): Promise<UserDTOInterface> =>
  api.get('/auth/me');

export const logout = (): Promise<boolean> =>
  api.post('/auth/logout');
