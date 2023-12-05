import { getReducerWithProduce } from "../../utils";
import { UseSystemSettings } from "./useSystemSettings.enums";
import { Status } from "../../enums";

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