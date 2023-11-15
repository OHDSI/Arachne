import { api } from ".";

export const getSubmissions = (): Promise<any> =>
    api.get('/admin/submissions');

export const createSubmission = (data): Promise<any> =>
    api.post('/admin/submissions', data);

export const updateSubmission = (id, data): Promise<any> =>
    api.post(`/admin/submissions/${id}`, data);