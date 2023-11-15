import { SubmissionStatus } from "../enums/SubmissionStatus";


export function getSubmissionStatusInfo(value: SubmissionStatus) {
  switch (value) {
    case SubmissionStatus.EXECUTED:
      return { color: 'success', name: 'Executed' };
    case SubmissionStatus.PENDING:
      return { color: 'warning', name: 'Pending' };
    case SubmissionStatus.FAILED:
      return { color: 'error', name: 'Failed' };
    case null:
      return { color: 'secondary', name: 'In Progress' };
    default:
      return null;
  }
}
