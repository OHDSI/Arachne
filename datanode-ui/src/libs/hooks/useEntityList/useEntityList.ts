import { produce } from 'immer';
import { Reducer, useCallback, useEffect, useReducer } from 'react';

import type { IEntityList } from './useEntityList.types';
import { EntityListConstants, INITIAL_STATE } from './useEntityList.constants';
import { Status } from '../../enums';

const reducer = (initialState: IEntityList, action: any) => {
  return produce(initialState, (draft: IEntityList) => {
    switch (action.type) {
      case EntityListConstants.FETCH_REQUEST:
        draft.status =
          draft.status === Status.INITIAL
            ? Status.IN_PROGRESS
            : Status.IN_PROGRESS_RELOAD;
        break;
      case EntityListConstants.FETCH_REQUEST_DONE:
        draft.data.tableData = action.payload.content || action.payload;
        draft.data.filtersData = action.payload.filters;
        draft.actions = action.payload.actions;
        draft.pageCount = action.payload.totalPages || 1;
        draft.pageNumber = action.payload.pageable?.pageNumber || 0;
        draft.numberOfElements = action.payload.numberOfElements;
        draft.totalElements = action.payload.totalElements;
        draft.sort = action.payload.sort;
        draft.status = Status.SUCCESS;
        break;
      case EntityListConstants.UPDATE_FILTERS:
        draft.filters = {
          ...draft.filters,
          ...action.payload,
        };
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
        // const query = parseFiltersToStringParams(state.filters);
        const result: any = await methods.get(
          // pageNumber,
          // pageSize,
          // sort,
          // query
        );

        // const filters: any =
        //   (await methods.getFilters?.(query).then(formatFilterListNoFiql)) ||
        //   [];
        dispatch({
          type: EntityListConstants.FETCH_REQUEST_DONE,
          payload: {
            ...result,
            reload: isSilentReload && reloadId,
            // filters,
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

  // const updateFilters = useCallback(
  //   (filters: SelectedFiltersInterface) => {
  //     dispatch({
  //       type: EntityListConstants.UPDATE_FILTERS,
  //       payload: filters,
  //     });
  //   },
  //   [state.filters]
  // );

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
    // updateFilters,
  };
};
