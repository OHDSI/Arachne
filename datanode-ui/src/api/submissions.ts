import { getSortDirection } from "../libs/utils/getSortDirection";
import { api } from ".";

export const getDescriptors = () => {
  return api.get('/descriptor');
}

export const getAnalysisTypes = () => {
  return api.get('/analysis/types');
}

export const getSubmissions = (pageNumber = 1, pageSize = 15, sortBy = { id: 'name', desc: true }): Promise<any> => {
  const sort = getSortDirection(sortBy);
  return api.get(`/admin/submissions?` +
    `page=${pageNumber + 1}`);
}
export const createSubmission = (data): Promise<any> =>
  api.post('/admin/submissions', data);

export const updateSubmission = (id, data): Promise<any> =>
  api.post(`/admin/submissions/${id}`, data);