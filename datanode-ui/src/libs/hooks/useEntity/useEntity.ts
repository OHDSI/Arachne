import { useNotifications } from '../../components';
import { Reducer, useCallback, useEffect, useReducer } from 'react';
import { INITIAL_STATE, reducer } from './useEntity.reducer';
import { EntityActions } from './useEntity.constants';

export const useEntity = <T extends object>(
  methods: {
    get: (id: string) => Promise<T>,
    delete: (id: string) => Promise<boolean>;
    update: (entity: T, id: string) => Promise<T>;
  },
  id: string,
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
        message: 'Something went wrong. ' + e.statusText,
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
          message: 'Something went wrong. ' + e.statusText,
          variant: 'error',
        });
      }
    },
    [id]
  );

  useEffect(() => {
    id != 'new' && getEntity();
  }, [id]);

  return {
    ...state,
    getEntity,
    deleteEntity,
    updateEntity
  };
};

