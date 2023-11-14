import { api } from './';

export const getDataSources = (): Promise<any> =>
    api.get('/data-sources');

export const removeDataSource = (): Promise<any> =>
    api.delete('/data-sources/');



export const createDataSource = (data): Promise<any> =>
    api.post('/data-sources', data);

export const updateDataSource = (id, data): Promise<any> =>
    api.post(`/data-sources/${id}`, data);

export const getDbmsTypes = (): Promise<any> => {
    return api.get('/data-sources/dbms-types');
};