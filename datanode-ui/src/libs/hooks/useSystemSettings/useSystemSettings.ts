import React, { useCallback, useEffect } from "react";

import { systemSettings, updateSystemSettings } from "../../../api/admin";

import { INITIAL_STATE } from "./useSytemSettings.constants";
import { reducer } from "./useSystemSettings.reducer";
import { UseSystemSettings } from "./useSystemSettings.enums";
import { whitelistSections } from "./useSystemSettings.config";


export const useSystemSettings = () => {

  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

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
  }, [getSystemSettings]);


  return {
    ...state,
    editSystemSettings
  }
}