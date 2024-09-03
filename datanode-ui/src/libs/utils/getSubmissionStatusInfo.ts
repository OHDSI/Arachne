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

import { SubmissionStatus } from "../enums";


export function getSubmissionStatusInfo(value: SubmissionStatus) {
  switch (value) {
    case SubmissionStatus.CREATED:
      return { color: "default", name: "Created" };
    case SubmissionStatus.EXECUTED:
      return { color: "success", name: "Executed" };
    case SubmissionStatus.EXECUTING:
      return { color: "warning", name: "Executing" };
    case SubmissionStatus.EXECUTION_FAILURE:
      return { color: "error", name: "Failed" };
    case SubmissionStatus.ABORTING:
      return { color: "warning", name: "Aborting" };
    // case SubmissionStatus.ABORTED:
    //   return { color: "error", name: "Aborted" };
    case SubmissionStatus.DEAD:
      return { color: "error", name: "Timed out" };
    case null:
      return { color: "secondary", name: "In Progress" };
    case SubmissionStatus.INITIALIZE:
      return {
        color: 'secondary',
        name: 'Initialize',
      };
    case SubmissionStatus.EXECUTE:
      return {
        color: 'warning',
        name: 'Executing...',
      };
    case SubmissionStatus.COMPLETED:
      return {
        color: 'success',
        name: 'Completed',
      };
    case SubmissionStatus.FAILED:
    case SubmissionStatus.ABORT_FAILURE:
      return { color: 'error', name: 'Failed' };
    case SubmissionStatus.ABORTED:
      return { color: 'error', name: 'Canceled' };
    case SubmissionStatus.PENDING:
    case null:
      return { color: 'warning', name: 'Pending' };
    default:
      return { color: "secondary", name: "N/A" };
  }
}
