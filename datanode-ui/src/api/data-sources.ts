import { BaseResponceInterface, DBMSTypesInterface, DataSourceDTOInterface } from '../libs/types';
import { api } from './';

export const getDataSources = (): Promise<BaseResponceInterface<DataSourceDTOInterface[]>> =>
    api.get('/data-sources');

export const getDataSource = (id: string): Promise<BaseResponceInterface<DataSourceDTOInterface>> =>
    api.get(`/data-sources/${id}`);

export const removeDataSource = (id: string): Promise<BaseResponceInterface<boolean>> =>
    api.delete(`/data-sources/${id}`);

export const createDataSource = (data): Promise<BaseResponceInterface<DataSourceDTOInterface>> =>
    api.post('/data-sources', data);

export const updateDataSource = (data, id): Promise<BaseResponceInterface<DataSourceDTOInterface>> =>
    api.put(`/data-sources/${id}`, data);

export const getDbmsTypes = (): Promise<DBMSTypesInterface[]> =>
    api.get('/data-sources/dbms-types');

export const publishDataSource: any = (dataSourceId: string, data: any) => {
    return api.post(`/data-sources/${dataSourceId}/publish`, data);
};