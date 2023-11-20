import { useNotifications } from '../../components';
import { Status } from '../../enums';
import { Reducer, useCallback, useEffect, useReducer } from 'react';
import { reducer } from './useEntity.reducer';
import { EntityActions } from './useEntity.constants';

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
      let data: any = await methods.get(id);

      dispatch({
        type: EntityActions.GET_ENTITY_SUCCESS,
        payload: { data: data.result },
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

