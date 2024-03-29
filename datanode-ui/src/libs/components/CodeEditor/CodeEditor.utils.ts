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

import { merge } from "lodash";
import {
  commonCodeEditorOptions,
  validationCodeEditorOptions,
} from "./CodeEditor.constants";
export function getCodeEditorOptions(
  userOptions: Record<string, any>,
  enableValidation: boolean = true
) {
  if (!userOptions.readOnly && enableValidation) {
    return merge(
      commonCodeEditorOptions,
      validationCodeEditorOptions,
      userOptions
    );
  }
  return merge(commonCodeEditorOptions, userOptions);
}
