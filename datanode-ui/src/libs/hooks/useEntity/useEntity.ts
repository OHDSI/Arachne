import { Reducer, useCallback, useEffect, useReducer } from 'react';
import { INITIAL_STATE, reducer } from './useEntity.reducer';
import { EntityActions } from './useEntity.constants';
import { EntityHook, EntityState, MethodsUseEntityInterface } from './useEntity.types';
import { ActionInterface } from '../../../libs/types';

export const useEntity = <T extends object>(
  methods: MethodsUseEntityInterface<T>,
  id: string
): EntityHook<T> => {
  const [state, dispatch] = useReducer<Reducer<EntityState<T>, ActionInterface<EntityActions>>>(
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
    } catch (e) {
      dispatch({
        type: EntityActions.DELETE_ENTITY_ERROR,
        payload: { error: e },
      });
    }
  }, [id]);

  const updateEntity = useCallback(async (entity: any) => {
    dispatch({ type: EntityActions.UPDATE_ENTITY });
    try {
      let data = await methods.update(entity, id);
      dispatch({
        type: EntityActions.UPDATE_ENTITY_SUCCESS,
        payload: { data },
      });
    } catch (e) {
      dispatch({
        type: EntityActions.UPDATE_ENTITY_ERROR,
        payload: { error: e },
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

