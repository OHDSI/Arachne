import {SubmissionStatus} from "../enums";


export function getSubmissionStatusInfo(value: SubmissionStatus) {
  switch (value) {
    case SubmissionStatus.CREATED:
      return { color: 'default', name: 'Created' };
    case SubmissionStatus.EXECUTED:
      return { color: 'success', name: 'Executed' };
    case SubmissionStatus.EXECUTING:
      return { color: 'warning', name: 'Executing' };
    case SubmissionStatus.EXECUTION_FAILURE:
      return { color: 'error', name: 'Failed' };
    case SubmissionStatus.ABORTING:
      return { color: 'warning', name: 'Aborting' };
    case SubmissionStatus.ABORT_FAILURE:
      return { color: 'warning', name: 'Failed to Abort' };
    case SubmissionStatus.ABORTED:
      return { color: 'error', name: 'Aborted' };
    case SubmissionStatus.DEAD:
      return { color: 'error', name: 'Timed out' };
    case null:
      return { color: 'secondary', name: 'In Progress' };
    default:
      return { color: 'default', name: 'N/A' };
  }
}
