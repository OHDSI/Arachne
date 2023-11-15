import { api } from "../../../api";

export const resultsSubmission: any = (submissionId: string, url) => {
  return api.get(`/${url}/${submissionId}/results/list`);
};
export const resultFileSubmission: any = (
  submissionId: string,
  itemId: string,
  url: string
) => {
  return api.get(`/${url}/${submissionId}/results/list/${itemId}`);
};
