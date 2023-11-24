import { SubmissionStatus } from "../enums";


export function getSubmissionStatusInfo(value: SubmissionStatus) {
  switch (value) {
    case SubmissionStatus.CREATED:
      return { color: 'success', name: 'Created' };
    case SubmissionStatus.EXECUTED:
      return { color: 'success', name: 'Executed' };
    case SubmissionStatus.EXECUTING:
      return { color: 'warning', name: 'Executing' };
    case SubmissionStatus.FAILED:
    case SubmissionStatus.EXECUTION_FAILURE:
    case SubmissionStatus.FILES_DOWNLOAD_FAILURE:
    case SubmissionStatus.SENDING_TO_CENTRAL_FAILURE:
      return { color: 'error', name: 'Failed' };
    case SubmissionStatus.EXECUTION_READY:
      return { color: 'success', name: 'Ready' };
    case SubmissionStatus.PENDING:
      return { color: 'warning', name: 'Pending' };
    case SubmissionStatus.CLOSED:
      return { color: 'error', name: 'Closed' };
    case SubmissionStatus.DEAD:
      return { color: 'error', name: 'Closed' };
    case null:
      return { color: 'secondary', name: 'In Progress' };
    default:
      return { color: 'default', name: 'N/A' };;
  }
}
