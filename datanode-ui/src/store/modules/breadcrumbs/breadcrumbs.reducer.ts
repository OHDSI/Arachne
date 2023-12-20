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

import { produce } from "immer";
import { BreadcrumbsActions } from "./breadcrumbs.constants";
import { BreadcrumbsState } from "./breadcrumbs.types";

const INITIAL_STATE: BreadcrumbsState = {
  // status: Status.INITIAL,
  breadcrumbs: [],
};

export const breadcrumbsReducer = (state = INITIAL_STATE, action: any) => {
  // @ts-ignore
  return produce(state, (draft: BreadcrumbsState) => {
    switch (action.type) {
    case BreadcrumbsActions.SET_BREADCRUMBS: {
      draft.breadcrumbs = action.payload;
      break;
    }
    case BreadcrumbsActions.RESET_BREADCRUMBS:
      draft.breadcrumbs = [];
      break;
    }
  });
};
