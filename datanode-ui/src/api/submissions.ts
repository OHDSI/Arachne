/*
 *
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
  api.get("/descriptor");

export const getAnalysisTypes = (): Promise<IdNameInterface<AnalysisTypes>[]> =>
  api.get("analysis/types");

export const getSubmissions = (pageNumber = 0, pageSize = 15, sortBy = { id: "id", desc: true }): Promise<PageableDTOInterface<SubmissionDTOInterface>> => {
  const sort = getSortDirection(sortBy);
  return api.get(`/admin/submissions?${pageNumber ? "page=" + pageNumber + "&" : ""}` + `sort=${sort}`);
};

export const createSubmission = (type: CreateSubmissionFormTabs, data): Promise<any> =>
  api.post(`/analysis/${type === CreateSubmissionFormTabs.FILES_IN_ARCHIVE ? "zip" : "files"}`, data);

export const getSubmission = (id): Promise<SubmissionDTOInterface> =>
  api.get(`/analysis/${id}`);

export const updateSubmission = (id, data): Promise<SubmissionDTOInterface> =>
  api.post(`/analysis/${id}/rerun`, data);


export const cancelSubmission = (id): Promise<any> =>
  api.post(`/analysis/${id}/cancel`);

export const getSubmissionLog = (id: string) =>
  api.get(`/analysis/${id}/log`);
