import axios from 'axios';

const successResponse = (res: any) => res.data;
const fileSuccessResponse = (res: any) => res;
const errorResponse = (error: any) => Promise.reject(error);

const unauthorizeUser = (error: any, store: any) => {
  const { status } = error?.response || {};
  if (status === 401) store.dispatch({ type: 'USER_GET_REQUEST_FAILED' });
};

const instance = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

const fileInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

const actuatorInstance = axios.create({
  baseURL: '/documentation',
});

instance.interceptors.response.use(successResponse, errorResponse);
fileInstance.interceptors.response.use(fileSuccessResponse, errorResponse);
actuatorInstance.interceptors.response.use(successResponse, errorResponse);

export const api = instance;
export const fileApi = fileInstance;
export const actuator = actuatorInstance;
// provides an ability to setup interceptors after store is initialized, it's not mandatory, default interceptors already work
export const setupInterceptors = (store: any) => {
  instance.interceptors.response.use(
    response => response,
    error => {
      unauthorizeUser(error, store);
      throw error;
    }
  );
  fileInstance.interceptors.response.use(
    response => response,
    error => {
      unauthorizeUser(error, store);
      return error;
    }
  );
};
