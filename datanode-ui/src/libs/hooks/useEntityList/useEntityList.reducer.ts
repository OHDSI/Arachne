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

import { Status } from "../../enums";
import { getReducerWithProduce } from "../../utils";
import { EntityListConstants } from "./useEntityList.constants";
import { IEntityList } from "./useEntityList.types";

export const reducer = (initialState: IEntityList, action: any) => {
  return getReducerWithProduce(initialState, (draft: IEntityList) => {
    switch (action.type) {
    case EntityListConstants.FETCH_REQUEST:
      draft.status =
          draft.status === Status.INITIAL
          	? Status.IN_PROGRESS
          	: Status.IN_PROGRESS_RELOAD;
      break;
    case EntityListConstants.FETCH_REQUEST_DONE:
      draft.data.tableData = action.payload.content || action.payload.result;
      draft.actions = action.payload.actions;
      draft.pageCount = action.payload.totalPages || 1;
      draft.pageNumber = action.payload.pageable?.pageNumber || 0;
      draft.numberOfElements = action.payload.numberOfElements || action.payload.result.length;
      draft.totalElements = action.payload.totalElements || action.payload.result.length;
      draft.sort = action.payload.sort;
      draft.engine = action.payload?.engine
      draft.status = Status.SUCCESS;
      break;
    case EntityListConstants.FETCH_REQUEST_FAILED:
      draft.data.tableData = [];
      draft.actions = [];
      draft.error = action.payload;
      draft.status = Status.ERROR;
      break;
    case EntityListConstants.SET_COUNT:
      draft.pageCount = action.payload;
      break;
    case EntityListConstants.SET_SIZE:
      draft.pageSize = action.payload;
      break;
    case EntityListConstants.SET_NUMBER:
      draft.pageNumber = action.payload;
      break;
    case EntityListConstants.REMOVE_REQUEST:
      break;
    case EntityListConstants.REMOVE_REQUEST_DONE:
      break;
    case EntityListConstants.REMOVE_REQUEST_FAILED:
      break;
    case EntityListConstants.SET_LIST_SORTING:
      draft.allowedSorting = action.payload;
      break;
    }
  });
};