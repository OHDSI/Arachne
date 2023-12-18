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

import { getReducerWithProduce } from "../../utils";
import { UseSystemSettings } from "./useSystemSettings.enums";
import { Status } from "../../enums";

export const reducer = (state, action) => {
  return getReducerWithProduce(state, draft => {
    switch (action.type) {
    case UseSystemSettings.GET_LIST:
      draft.status = Status.IN_PROGRESS_RELOAD;
      break;
    case UseSystemSettings.GET_LIST_DONE:
      draft.status = Status.DISABLED;
      draft.settings = action.payload;
      break;
    case UseSystemSettings.GET_LIST_FAILED:
      draft.status = Status.ERROR;
      break;
    case UseSystemSettings.UPDATED_VALUE:
      draft.status = Status.IN_PROGRESS;
      break;
    case UseSystemSettings.UPDATED_VALUE_DONE:
      draft.status = Status.SUCCESS;
      break;
    case UseSystemSettings.UPDATED_VALUE_FAILED:
      draft.status = Status.ERROR;
      break;
    }
  });
};