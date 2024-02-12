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
import { EntityState } from "./useEntity.types";
import { EntityActions } from "./useEntity.constants";
import { Status } from "../../enums";
import { ActionInterface } from "@/libs/types";

export const INITIAL_STATE: EntityState = {
  entity: null,
  version: null,
  draft: null,
  isVersionMode: false,
  status: Status.INITIAL,
  error: null,
};

export const reducer = <T extends object>(
  state: EntityState<T>,
  action: ActionInterface<EntityActions>
) => {
  return getReducerWithProduce(state, (draft: EntityState<T>) => {
    switch (action.type) {
    case EntityActions.GET_ENTITY:
      draft.status =
          state.status === Status.INITIAL
          	? Status.IN_PROGRESS
          	: Status.IN_PROGRESS_RELOAD;
      break;
    case EntityActions.GET_ENTITY_SUCCESS:
      draft.entity = action.payload.data;
      draft.draft = action.payload.data;
      draft.status = Status.SUCCESS;
      break;
    case EntityActions.GET_ENTITY_ERROR:
      draft.error = { ...action.payload.error, message: "Not found" };
      draft.status = Status.ERROR;
      break;
    case EntityActions.DELETE_ENTITY:
      draft.status = Status.IN_PROGRESS;
      break;
    case EntityActions.DELETE_ENTITY_SUCCESS:
      draft.status = Status.DELETE_SUCCESS;
      break;
      // case EntityActions.DELETE_ENTITY_ERROR:
      //   draft.status = Status.ERROR;
      //   break;
    case EntityActions.UPDATE_ENTITY:
      draft.status = Status.IN_PROGRESS_RELOAD;
      break;
    case EntityActions.UPDATE_ENTITY_SUCCESS:
      draft.isVersionMode = false;
      draft.version = null;
      draft.entity = action.payload.data;
      draft.draft = action.payload.data;
      draft.status = Status.SUCCESS;
      break;
      // case EntityActions.UPDATE_ENTITY_ERROR:
      //   draft.status = Status.ERROR;
      //   break;
    case EntityActions.SET_VERSION:
      draft.version = action.payload;
      draft.draft = action.payload;
      draft.isVersionMode = true;
      break;
    case EntityActions.REVERT_VERSION:
      draft.version = null;
      draft.isVersionMode = false;
      draft.draft = draft.entity;
      break;
    }
  });
};