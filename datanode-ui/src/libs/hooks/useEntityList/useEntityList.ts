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

import { Reducer, useCallback, useEffect, useReducer } from "react";

import type { IEntityList } from "./useEntityList.types";
import { EntityListConstants, INITIAL_STATE } from "./useEntityList.constants";
import { reducer } from "./useEntityList.reducer";

export const useEntityList = <T extends object = object>(
  methods: {
    get: (pageNumber: number, pageSize: number, sort: { id: string, desc: boolean }) => T;
    remove?: any;
    getFilters?: any;
    getSorting?: any;
  },
  reloadId?: string,
  isSilentReload?: boolean,
  initialStorageState?: any
) => {
  const [state, dispatch] = useReducer<Reducer<IEntityList, any>>(reducer, {
    ...INITIAL_STATE,
    pageSize: initialStorageState?.pageSize || INITIAL_STATE.pageSize,
  } as IEntityList<T>);

  const getEntity = useCallback(
    async (pageNumber?: number, pageSize?: number, sort?: { id: string, desc: boolean }) => {
      dispatch({
        type: EntityListConstants.FETCH_REQUEST,
        payload: isSilentReload && reloadId,
      });
      try {

        const result: T = await methods.get(
          pageNumber,
          pageSize,
          sort,
        );

        dispatch({
          type: EntityListConstants.FETCH_REQUEST_DONE,
          payload: {
            ...result,
            result: result,
            reload: isSilentReload && reloadId,
            sort,
          },
        });
      } catch (e) {
        console.error("ERROR", e);
        dispatch({
          type: EntityListConstants.FETCH_REQUEST_FAILED,
          payload: e,
        });
      }
    },
    [methods.get, reloadId]
  );

  const removeEntity = useCallback(
    async (id: string) => {
      dispatch({
        type: EntityListConstants.REMOVE_REQUEST,
        payload: id,
      });
      try {
        await methods.remove(id);
        await getEntity(state.pageNumber, state.pageSize, state.sort);
        dispatch({
          type: EntityListConstants.REMOVE_REQUEST_DONE,
          payload: id,
        });
      } catch (err) {
        dispatch({
          type: EntityListConstants.REMOVE_REQUEST_FAILED,
          payload: {
            err,
          },
        });
      }
    },
    [methods.remove, state.pageNumber, state.pageSize, state.sort]
  );

  const setPageCount = useCallback((count: number) => {
    dispatch({
      type: EntityListConstants.SET_COUNT,
      payload: count,
    });
  }, []);

  const setPageNumber = useCallback((number: number) => {
    dispatch({
      type: EntityListConstants.SET_NUMBER,
      payload: number,
    });
  }, []);

  const setPageSize = (size: number) => {
    dispatch({
      type: EntityListConstants.SET_SIZE,
      payload: size,
    });
  };

  const setQuery = useCallback((query: string) => {
    dispatch({
      type: EntityListConstants.SET_QUERY,
      payload: query,
    });
  }, []);

  const getListSorting = useCallback(async () => {
    if (methods?.getSorting) {
      try {
        const sorting = await methods.getSorting();
        dispatch({
          type: EntityListConstants.SET_LIST_SORTING,
          payload: sorting,
        });
      } catch (err) {
        console.error("GET LIST SORTING: sth went wrong");
      }
    }
  }, []);

  useEffect(() => {
    getListSorting();
  }, [getListSorting]);

  return {
    ...state,
    getEntity,
    removeEntity,
    setPageCount,
    setPageNumber,
    setPageSize,
    setQuery,
  };
};
