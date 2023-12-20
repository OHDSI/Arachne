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
import { INITIAL_STATE, reducer } from "./useEntity.reducer";
import { EntityActions } from "./useEntity.constants";
import { EntityHook, EntityState, MethodsUseEntityInterface } from "./useEntity.types";
import { ActionInterface } from "../../../libs/types";

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
      const data = await methods.get(id);

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
      const data = await methods.delete(id);

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
      const data = await methods.update(entity, id);
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
    id != "new" && getEntity();
  }, [id]);

  return {
    ...state,
    getEntity,
    deleteEntity,
    updateEntity
  };
};

