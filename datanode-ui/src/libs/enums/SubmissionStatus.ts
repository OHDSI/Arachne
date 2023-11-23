// checked

export enum SubmissionStatus {
  EXECUTED = 'EXECUTED',
  PENDING = 'PENDING',
  EXECUTING = 'EXECUTING',
  EXECUTION_FAILURE = 'EXECUTION_FAILURE',
  FAILED = 'FAILED',
  SENDING_TO_CENTRAL_FAILURE = 'SENDING_TO_CENTRAL_FAILURE',
  FILES_DOWNLOAD_FAILURE = 'FILES_DOWNLOAD_FAILURE',
  EXECUTION_READY = 'EXECUTION_READY',
  CLOSED = 'CLOSED',
  DEAD = 'DEAD'
}

// CREATED("CREATED"),
//     FILES_DOWNLOAD_FAILURE("FILES DOWNLOAD FAILURE"),
//     EXECUTION_READY("EXECUTION READY"),
//     EXECUTION_FAILURE("EXECUTION FAILURE"),
//     EXECUTING("EXECUTING"),
//     EXECUTED("EXECUTED"),
//     SENDING_TO_CENTRAL_FAILURE("SENDING TO CENTRAL FAILURE"),
//     CLOSED("CLOSED"),
//     DEAD("DEAD");