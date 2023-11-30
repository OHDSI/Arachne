import { systemSettings, updateSystemSettings } from "../../../api/admin";
import { Status } from "../../enums";
import { getReducerWithProduce } from "../../utils";
import React, { useCallback, useEffect, useReducer } from "react";

enum UseSystemSettings {
  GET_LIST = 'GET_LIST',
  GET_LIST_DONE = 'GET_LIST_DONE',
  GET_LIST_FAILED = 'GET_LIST_FAILED',
  UPDATED_VALUE = 'UPDATED_VALUE',
  UPDATED_VALUE_DONE = 'UPDATED_VALUE_DONE',
  UPDATED_VALUE_FAILED = 'UPDATED_VALUE_FAILED'
}

const INITIAL_STATE = {
  settings: [],
  status: Status.INITIAL
}

const whitelistSections = ['integration', 'proxy'];

export const reducer = (state, action) => {
  return getReducerWithProduce(state, draft => {
    switch (action.type) {
      case UseSystemSettings.GET_LIST:
        draft.status = Status.IN_PROGRESS_RELOAD;
        break;
      case UseSystemSettings.GET_LIST_DONE:
        draft.status = Status.DISABLED;
        draft.settings = action.payload;
        break;
      case UseSystemSettings.GET_LIST_FAILED:
        draft.status = Status.ERROR;
        break;
      case UseSystemSettings.UPDATED_VALUE:
        draft.status = Status.IN_PROGRESS;
        break;
      case UseSystemSettings.UPDATED_VALUE_DONE:
        draft.status = Status.SUCCESS;
        break;
      case UseSystemSettings.UPDATED_VALUE_FAILED:
        draft.status = Status.ERROR;
        break;
    }
  })
}

export const useSystemSettings = () => {

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const getSystemSettings = useCallback(async () => {
    dispatch({
      type: UseSystemSettings.GET_LIST
    })

    try {
      const result = await systemSettings();
      dispatch({
        type: UseSystemSettings.GET_LIST_DONE,
        payload: result.list.filter(elem => whitelistSections.includes(elem.name))
      })
    } catch (e) {

    }
  }, []);

  const editSystemSettings = useCallback(async (values) => {
    const res = {
      values: {}
    }
    dispatch({
      type: UseSystemSettings.UPDATED_VALUE
    })

    Object.values(values).forEach((elem: any) => {
      res.values[elem.id] = elem.value
    })

    try {
      await updateSystemSettings(res);
      dispatch({
        type: UseSystemSettings.UPDATED_VALUE_DONE
      })
    } catch (e) {

    }
  }, []);

  useEffect(() => {
    getSystemSettings();
  }, []);


  return {
    ...state,
    editSystemSettings
  }
}