import { api } from "../../../api";

export const resultsSubmission: any = (submissionId: string, url) => {
  return api.get(`/${url}/${submissionId}/results/list?size=${'1000'}`);
};

export const resultFileSubmission: any = (
  submissionId: string,
  itemId: string,
  url: string
) => {
  return api.get(`/${url}/${submissionId}/results/${itemId}/download`);
};
