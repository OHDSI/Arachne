import { getSubmissionLog } from "../../../api/submissions"
import { useEffect, useReducer } from "react";
import { useInterval } from "../useInterval";
import { getReducerWithProduce } from "../../utils";
import { Status } from "../../enums";


const INITIAL_STATE = {
  log: null,
  reloadId: null,
  status: Status.INITIAL,
}


enum UseSubmissionLog {
  GET_LOG = 'GET_LOG',
  GET_LOG_DONE = 'GET_LOG_DONE',
  GET_LOG_FEAILED = 'GET_LOG_FAILED',
}


const reducer = (state, action) => {
  return getReducerWithProduce(state, draft => {
    switch (action.type) {
      case UseSubmissionLog.GET_LOG:
        if (draft.log) {
          draft.status = Status.IN_PROGRESS;
        } else {
          draft.status = Status.IN_PROGRESS_RELOAD;
        }
        break;
      case UseSubmissionLog.GET_LOG_DONE:
        draft.status = Status.SUCCESS;
        draft.log = action.payload;
        break;
      case UseSubmissionLog.GET_LOG_FEAILED:
        draft.status = Status.ERROR
        draft.log = null;
    }
  })
}

export const useSubmissionLog = (id) => {

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const getLogs = async () => {
    dispatch({
      type: UseSubmissionLog.GET_LOG
    })
    try {
      const result = await getSubmissionLog(id);
      dispatch({
        type: UseSubmissionLog.GET_LOG_DONE,
        payload: result
      })
    } catch (e) {
      dispatch({
        type: UseSubmissionLog.GET_LOG_FEAILED
      })
    }
  }

  useInterval(() => {
    getLogs();
  }, 10000);

  useEffect(() => {
    getLogs();
  }, []);

  return {
    ...state
  }
}