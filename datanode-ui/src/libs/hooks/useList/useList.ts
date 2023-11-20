import { useEffect, useCallback, useReducer, Reducer } from 'react';
import {
  IUseListProps,
  IUseList,
} from './useList.types';
import { useListReducer } from './useList.reducer';
import { useListInitialState } from './useList.constants';
import { UseListActionType } from './useList.enums';

export function useList(props: IUseListProps): IUseList {
  const {
    primaryKey = 'id',
    autoLoad = false,
    async = true,
    values = [],
    methods,
  } = props;

  const {
    read: Read,
    get: Get,
    create: Create,
    update: Update,
    delete: Delete,
    sort: Sort,
  } = methods || {};

  const [store, dispatch] = useReducer<
    Reducer<any, any>
  >(useListReducer, useListInitialState);

  const {
    isLoading,
    isLoaded,
    byId,
    ids,
    processingIds,
    isError,
    actions,
    status,
  } = store;

  const getEntityList = useCallback(
    async (params, customFormatter?) => {
      if (!Read?.method && async) {
        throw Error('"Read" method is not defined.');
      }

      if (!async) {
        dispatch({
          type: UseListActionType.GET_ENTITY_LIST_SUCCESS,
          payload: values as any,
        });
        return;
      }

      try {
        dispatch({
          type: UseListActionType.GET_ENTITY_LIST_PENDING,
        });
        const response = await Read.method(params || {});
        const data = response.content || response.result;
        console.log(data)
        const actions = response.actions;
        dispatch({
          type: UseListActionType.GET_ENTITY_LIST_SUCCESS,
          payload: {
            data:
              customFormatter && typeof customFormatter === 'function'
                ? customFormatter(data)
                : Read.formatter && typeof Read.formatter === 'function'
                  ? Read.formatter(data)
                  : data,
            actions,
            primaryKey,
            ...response,
          },
        });
      } catch (err) {
        dispatch({
          type: UseListActionType.GET_ENTITY_LIST_FAILURE,
          payload: {
            err,
          },
        });
      }
    },
    [async, ...(!async ? [values] : []), primaryKey]
  );

  const createEntity = useCallback(
    async (entity: any, async = false) => {
      if (!Create?.method && async) {
        throw Error('"Create" method is not defined.');
      }

      if (!async) {
        dispatch({
          type: UseListActionType.CREATE_ENTITY_SUCCESS,
          payload: {
            data: entity,
            primaryKey,
          },
        });
        return;
      }

      try {
        dispatch({
          type: UseListActionType.CREATE_ENTITY_PENDING,
          payload: {
            data: entity,
            primaryKey,
          },
        });
        const response = await Create?.method(entity);
        dispatch({
          type: UseListActionType.CREATE_ENTITY_SUCCESS,
          payload: {
            data: response,
            primaryKey,
          },
        });
      } catch (err) {
        dispatch({
          type: UseListActionType.CREATE_ENTITY_FAILURE,
          payload: {
            err,
          },
        });
      }
    },
    [primaryKey]
  );

  const updateEntity = useCallback(async id => { }, []);

  const getEntity = useCallback(async id => {
    if (!Get?.method && async) {
      throw Error('"Get" method is not defined.');
    }
    try {
      const response = await Get?.method(id);
      const format = Get?.formatter([response]);
      dispatch({
        type: UseListActionType.GET_ENTITY_SUCCESS,
        payload: {
          id: response.id,
          data: format[0],
        },
      });
    } catch (e: any) { }
  }, []);

  const removeEntity = useCallback(
    async (entity: any, async = false) => {
      if (!Delete?.method && async) {
        throw Error('"Delete" method is not defined.');
      }

      if (!async) {
        dispatch({
          type: UseListActionType.DELETE_ENTITY_SUCCESS,
          payload: {
            data: entity,
            primaryKey,
          },
        });
        return;
      }

      try {
        dispatch({
          type: UseListActionType.DELETE_ENTITY_PENDING,
          payload: {
            data: entity,
            primaryKey,
          },
        });
        const response = await Delete?.method(entity);
        dispatch({
          type: UseListActionType.DELETE_ENTITY_SUCCESS,
          payload: {
            data: entity,
            primaryKey,
          },
        });
      } catch (err) {
        dispatch({
          type: UseListActionType.DELETE_ENTITY_FAILURE,
          payload: {
            err,
            data: entity,
            primaryKey,
          } as any,
        });
      }
    },
    [primaryKey]
  );

  const getListSorting = useCallback(async () => {
    if (Sort) {
      try {
        const sorting = await Sort.method();
        dispatch({
          type: UseListActionType.GET_ALLOWED_SORTING_SUCCESS,
          payload: {
            allowedSorting: sorting,
          },
        });
      } catch (err) {
        console.error('GET LIST SORTING: sth went wrong');
      }
    }
  }, []);

  useEffect(() => {
    autoLoad && getEntityList({});
  }, [autoLoad]);

  useEffect(() => {
    getListSorting();
  }, [getListSorting]);

  return {
    ...store,
    processingIds,
    data: {
      byId,
      ids,
    },
    getEntityList,
    createEntity,
    updateEntity,
    removeEntity,
    getEntity,
  };
}
