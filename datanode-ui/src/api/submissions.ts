import { api } from ".";
import { getSortDirection } from "../libs/utils";
import {
  DescriptorInterface,
  IdNameInterface,
  PageableDTOInterface,
  SubmissionDTOInterface
} from "../libs/types";
import {
  AnalysisTypes,
  CreateSubmissionFormTabs
} from "../libs/enums";

export const getDescriptors = (): Promise<DescriptorInterface[]> =>
  api.get('/descriptor')

export const getAnalysisTypes = (): Promise<IdNameInterface<AnalysisTypes>[]> =>
  api.get('analysis/types')

export const getSubmissions = (pageNumber = 0, pageSize = 15, sortBy = { id: 'id', desc: true }): Promise<PageableDTOInterface<SubmissionDTOInterface>> => {
  const sort = getSortDirection(sortBy);
  return api.get(`/admin/submissions?${pageNumber ? 'page=' + pageNumber + '&' : ''}` + `sort=${sort}`);
}

export const createSubmission = (type: CreateSubmissionFormTabs, data): Promise<any> =>
  api.post(`/analysis/${type === CreateSubmissionFormTabs.FILES_IN_ARCHIVE ? 'zip' : 'files'}`, data);

export const updateSubmission = (id, type, data): Promise<any> =>
  api.post(`/admin/analysis/${id}`, data);

export const getSubmissionLog = (id: string) =>
  api.get(`/analysis/${id}/log`)
