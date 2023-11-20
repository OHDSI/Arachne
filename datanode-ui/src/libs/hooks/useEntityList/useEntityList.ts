import { Reducer, useCallback, useEffect, useReducer } from 'react';

import type { IEntityList } from './useEntityList.types';
import { EntityListConstants, INITIAL_STATE } from './useEntityList.constants';
import { reducer } from './useEntityList.reducer';

export const useEntityList = <T extends object = object>(
  methods: {
    get: any;
    remove?: any;
    getFilters?: any;
    getSorting?: any;
  },
  reloadId?: any,
  isSilentReload?: boolean,
  initialStorageState?: any
) => {
  const [state, dispatch] = useReducer<Reducer<IEntityList, any>>(reducer, {
    ...INITIAL_STATE,
    filters: initialStorageState?.filters || INITIAL_STATE.filters,
    pageSize: initialStorageState?.pageSize || INITIAL_STATE.pageSize,
  } as IEntityList<T>);

  const getEntity = useCallback(
    async (pageNumber?: number, pageSize?: number, sort?: any) => {
      dispatch({
        type: EntityListConstants.FETCH_REQUEST,
        payload: isSilentReload && reloadId,
      });
      try {

        const result: any = await methods.get(
          pageNumber,
          pageSize,
          sort,
        );

        dispatch({
          type: EntityListConstants.FETCH_REQUEST_DONE,
          payload: {
            ...result,
            reload: isSilentReload && reloadId,
            sort,
          },
        });
      } catch (e) {
        console.error('ERROR', e);
        dispatch({
          type: EntityListConstants.FETCH_REQUEST_FAILED,
          payload: e,
        });
      }
    },
    [methods.get, state.filters, reloadId]
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
        console.error('GET LIST SORTING: sth went wrong');
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
