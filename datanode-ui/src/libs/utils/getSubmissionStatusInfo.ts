import { SubmissionStatus } from "../enums/SubmissionStatus";


export function getSubmissionStatusInfo(value: SubmissionStatus) {
  switch (value) {
    case SubmissionStatus.EXECUTED:
      return { color: 'success', name: 'Executed' };
    case SubmissionStatus.EXECUTING:
      return { color: 'warning', name: 'Executing' };
    case SubmissionStatus.FAILED:
      return { color: 'error', name: 'Failed' };
    case null:
      return { color: 'secondary', name: 'In Progress' };
    default:
      return null;
  }
}
