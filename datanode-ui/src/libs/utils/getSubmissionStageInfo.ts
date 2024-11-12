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

import { SubmissionState } from "../enums";

export function getSubmissionStageInfo(value: SubmissionState, error: string) {
  switch (value) {
    case SubmissionState.INITIALIZE:
      return { color: "secondary", name: "Initialize" };
    case SubmissionState.EXECUTE:
      return { color: "warning", name: "Executing" };
    case SubmissionState.COMPLETED:
      return { color: "success", name: "Completed" };
    case SubmissionState.ABORT:
      return { color: "warning", name: "Aborting" };
    case SubmissionState.ABORTED:
      return { color: "error", name: "Canceled" };
    case SubmissionState.DEAD:
      return { color: "error", name: "Dead" };
    case SubmissionState.FAILED:
      return { color: "error", name: "Failed" };
    case SubmissionState.UNKNOWN:
      return { color: "secondary", name: "Unknown" };
    default:
      return { color: "secondary", name: "N/A" };
  }
}