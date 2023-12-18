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
import type { IEntityList } from "./useEntityList.types";

export enum EntityListConstants {
  FETCH_REQUEST = "FETCH_REQUEST",
  FETCH_REQUEST_DONE = "FETCH_REQUEST_DONE",
  FETCH_REQUEST_FAILED = "FETCH_REQUEST_FAILED",
  REMOVE_REQUEST = "REMOVE_REQUEST",
  REMOVE_REQUEST_DONE = "REMOVE_REQUEST_DONE",
  REMOVE_REQUEST_FAILED = "REMOVE_REQUEST_FAILED",
  SET_COUNT = "SET_COUNT",
  SET_SIZE = "SET_SIZE",
  SET_QUERY = "SET_QUERY",
  SET_SORT = "SET_SORT",
  SET_NUMBER = "SET_NUMBER",
  SET_LIST_SORTING = "SET_LIST_SORTING",
  UPDATE_FILTERS = "UPDATE_FILTERS",
}

export const INITIAL_STATE: IEntityList = {
  data: { tableData: [] },
  pageCount: 1,
  pageSize: 15,
  isLoading: false,
  isReloadLoading: false,
  pageNumber: 0,
  sort: null,
  totalElements: 0,
  numberOfElements: 0,
  actions: null,
  allowedSorting: [],
  status: Status.INITIAL,
  error: null,
};
