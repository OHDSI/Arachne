import React, { useReducer, useCallback, ReactNode, Reducer } from 'react';
import { DialogActions } from './useDialog.constants';
import { reducer } from './useDialog.reducer';

const INITIAL_STATE = {
  component: null,
  props: {},
};

export const useDialog = () => {
  const [state, dispatch] = useReducer<Reducer<any, any>>(
    reducer,
    INITIAL_STATE
  );

  //   const setDialogComponent = useCallback(
  //     (component?: ReactNode) => {
  //       dispatch({ type: DialogActions.SET_COMPONENT, payload: component });
  //     },
  //     [dispatch]
  //   );

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
