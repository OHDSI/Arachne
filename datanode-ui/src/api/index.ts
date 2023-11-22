import axios, { AxiosError, AxiosResponse } from 'axios';

const successResponse = (res: AxiosResponse) => {
  console.log(res)
  return res.data
};
const fileSuccessResponse = (res: AxiosResponse) => res;
const errorResponse = (error: AxiosError) => Promise.reject(error);

const unauthorizeUser = (error: any, store: any) => {
  const { status } = error?.response || {};
  if (status === 401) store.dispatch({ type: 'USER_GET_REQUEST_FAILED' });
};

const instance = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

instance.interceptors.response.use(successResponse, errorResponse);

export const api = instance;

export const setupInterceptors = (store: any) => {
  instance.interceptors.response.use(
    response => response,
    error => {
      unauthorizeUser(error, store);
      throw error;
    }
  );
};
