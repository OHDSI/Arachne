import { useNotifications } from '../../components/Notification';
import { Status } from '../../enums';
import { produce } from 'immer';
import { Reducer, useCallback, useEffect, useReducer } from 'react';

export enum EntityActions {
  GET_ENTITY = 'GET_ENTITY',
  GET_ENTITY_SUCCESS = 'GET_ENTITY_SUCCESS',
  GET_ENTITY_ERROR = 'GET_ENTITY_ERROR',

  DELETE_ENTITY = 'DELETE_ENTITY',
  DELETE_ENTITY_SUCCESS = 'DELETE_ENTITY_SUCCESS',
  DELETE_ENTITY_ERROR = 'DELETE_ENTITY_ERROR',

  UPDATE_ENTITY = 'UPDATE_ENTITY',
  UPDATE_ENTITY_SUCCESS = 'UPDATE_ENTITY_SUCCESS',
  UPDATE_ENTITY_ERROR = 'UPDATE_ENTITY_ERROR',

  SET_VERSION = 'SET_VERSION',
  REVERT_VERSION = 'REVERT_VERSION',

  COPY_ENTITY = 'COPY_ENTITY',
  COPY_ENTITY_SUCCESS = 'COPY_ENTITY_SICCESS',
  COPY_ENTITY_ERROR = 'COPY_ENTITY_ERROR',
}

export interface EntityState<T, E = any> {
  entity: T;
  version: T;
  draft: T;
  isVersionMode: boolean;
  status: Status;
  error: E;
}
export interface EntityHook<T> extends EntityState<T> {
  getEntity: () => Promise<void>;
  deleteEntity: () => Promise<void>;
  updateEntity: (data: T) => Promise<void>;
  setVersionEntity: (data: T) => void;
  copyEntity: (data: T) => Promise<T>;
  revertEntity: () => void;
}
export interface EntityMethods<T> {
  get: (id?: string) => Promise<T>;
  delete?: (id: string) => Promise<void>;
  update: (data: T, id?: string) => Promise<T>;
  copy?: (id: string, name: string) => Promise<T>;
}
export const INITIAL_STATE = {
  entity: null,
  version: null,
  draft: null,
  isVersionMode: false,
  status: Status.INITIAL,
  error: null,
};

export const useEntity = (
  methods: any,
  id?: string,
  entityName?: string
): any => {
  const { enqueueSnackbar } = useNotifications();
  const [state, dispatch] = useReducer<Reducer<any, any>>(
    reducer,
    INITIAL_STATE
  );

  const getEntity = useCallback(async () => {
    dispatch({ type: EntityActions.GET_ENTITY });
    try {
      let data = await methods.get(id);

      dispatch({
        type: EntityActions.GET_ENTITY_SUCCESS,
        payload: { data },
      });
    } catch (e) {
      dispatch({
        type: EntityActions.GET_ENTITY_ERROR,
        payload: { error: e },
      });
    }
  }, [id]);

  const deleteEntity = useCallback(async () => {
    dispatch({ type: EntityActions.DELETE_ENTITY });
    try {
      let data = await methods.delete(id);

      dispatch({
        type: EntityActions.DELETE_ENTITY_SUCCESS,
        payload: { data },
      });
      enqueueSnackbar({
        message: (entityName || 'Entity') + ' deleted successfully.',
        variant: 'success',
      });
    } catch (e) {
      dispatch({
        type: EntityActions.DELETE_ENTITY_ERROR,
        payload: { error: e },
      });
      enqueueSnackbar({
        message: 'Something went wrong. ' + e.message,
        variant: 'error',
      });
    }
  }, [id]);

  const updateEntity = useCallback(
    async (entity: any) => {
      dispatch({ type: EntityActions.UPDATE_ENTITY });
      try {
        let data = await methods.update(entity, id);
        dispatch({
          type: EntityActions.UPDATE_ENTITY_SUCCESS,
          payload: { data },
        });
        enqueueSnackbar({
          message: (entityName || 'Entity') + ' updated successfully.',
          variant: 'success',
        });
      } catch (e) {
        console.error(e);
        dispatch({
          type: EntityActions.UPDATE_ENTITY_ERROR,
          payload: { error: e },
        });
        enqueueSnackbar({
          message: 'Something went wrong. ' + e.message,
          variant: 'error',
        });
      }
    },
    [id]
  );

  const copyEntity = useCallback(
    async entity => {
      dispatch({ type: EntityActions.COPY_ENTITY });

      try {
        let data = await methods.copy(
          entity.id,
          `Copy of ${entity.name || entity.title}`
        );

        dispatch({
          type: EntityActions.UPDATE_ENTITY_SUCCESS,
          payload: { data },
        });
        enqueueSnackbar({
          message: (entityName || 'Entity') + ' copied successfully.',
          variant: 'success',
        });

        return data;
      } catch (e) {
        dispatch({
          type: EntityActions.UPDATE_ENTITY_ERROR,
          payload: { error: e },
        });
        enqueueSnackbar({
          message: 'Something went wrong. ' + e.message,
          variant: 'error',
        });
      }
    },
    [id]
  );

  const setVersionEntity = useCallback(
    entity => {
      dispatch({
        type: EntityActions.SET_VERSION,
        payload: {
          ...entity,
          revertVersionId: entity.versionId,
          versionId: state.draft['versionId'],
        },
      });
    },
    [state.draft]
  );

  const revertEntity = () => {
    dispatch({
      type: EntityActions.REVERT_VERSION,
    });
  };

  useEffect(() => {
    id != 'new' && getEntity();
  }, [id]);

  return {
    ...state,
    getEntity,
    copyEntity,
    deleteEntity,
    updateEntity,
    setVersionEntity,
    revertEntity,
  };
};

export const reducer = <T extends object>(
  state: EntityState<T>,
  action: any
) => {
  return produce(state, (draft: EntityState<T>) => {
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
        draft.error = { ...action.payload.error, message: 'Not found' };
        draft.status = Status.ERROR;
        break;
      case EntityActions.DELETE_ENTITY:
        draft.status = Status.IN_PROGRESS;
        break;
      case EntityActions.DELETE_ENTITY_SUCCESS:
        draft.status = Status.SUCCESS;
        break;
      case EntityActions.DELETE_ENTITY_ERROR:
        // draft.error = action.payload.error;
        draft.status = Status.ERROR;
        break;
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
      case EntityActions.UPDATE_ENTITY_ERROR:
        // draft.error = action.payload.error;
        draft.status = Status.ERROR;
        break;
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
