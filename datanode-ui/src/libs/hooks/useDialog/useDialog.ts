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

import React, { useReducer, useCallback, Reducer } from "react";
import { DialogActions } from "./useDialog.constants";
import { reducer } from "./useDialog.reducer";

const INITIAL_STATE = {
  component: null,
  props: {},
};

export const useDialog = () => {
  const [state, dispatch] = useReducer<Reducer<any, any>>(
    reducer,
    INITIAL_STATE
  );

  const showDialog = useCallback(
    <T extends object>(component: React.FC<T>, props: T) => {
    	dispatch({
    		type: DialogActions.SHOW_DIALOG,
    		payload: { component, props },
    	});
    },
    [dispatch]
  );

  const hideDialog = useCallback(() => {
    dispatch({
      type: DialogActions.HIDE_DIALOG,
    });
  }, [dispatch]);

  const destroyDialog = useCallback(() => {
    dispatch({
      type: DialogActions.DESTROY_DIALOG,
    });
  }, []);

  return { ...state, hideDialog, showDialog, destroyDialog };
};
