import { api } from './';
import { DBMSTypesInterface, DataSourceDTOInterface } from '../libs/types';

export const getDataSources = (): Promise<DataSourceDTOInterface[]> =>
    api.get('/data-sources');

export const getDataSource = (id: string): Promise<DataSourceDTOInterface> =>
    api.get(`/data-sources/${id}`);

export const removeDataSource = (id: string): Promise<boolean> =>
    api.delete(`/data-sources/${id}`);

export const createDataSource = (data): Promise<DataSourceDTOInterface> =>
    api.post('/data-sources', data);

export const updateDataSource = (data, id): Promise<DataSourceDTOInterface> =>
    api.put(`/data-sources/${id}`, data);

export const getDbmsTypes = (): Promise<DBMSTypesInterface[]> =>
    api.get('/data-sources/dbms-types');