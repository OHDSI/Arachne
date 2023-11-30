import {api} from ".";
import {getSortDirection} from "../libs/utils";
import {DescriptorInterface, IdNameInterface, PageableDTOInterface, SubmissionDTOInterface} from "../libs/types";
import {AnalysisTypes} from "../libs/enums";

export const getDescriptors = (): Promise<DescriptorInterface[]> =>
  api.get('/descriptor')

export const getAnalysisTypes = (): Promise<IdNameInterface<AnalysisTypes>[]> =>
  api.get('analysis/types')

export const getSubmissions = (pageNumber = 0, pageSize = 15, sortBy = { id: 'id', desc: true }): Promise<PageableDTOInterface<SubmissionDTOInterface>> => {
  const sort = getSortDirection(sortBy);
  return api.get(`/admin/submissions?${pageNumber ? 'page=' + pageNumber + '&' : ''}` + `sort=${sort}`);
}

export const createSubmission = (data): Promise<any> =>
  api.post('/analysis', data);

export const updateSubmission = (id, data): Promise<any> =>
  api.post(`/admin/submissions/${id}`, data);