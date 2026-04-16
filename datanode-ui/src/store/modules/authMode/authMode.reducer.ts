import { produce } from "immer";
import { AuthModeActions } from "./authMode.constants";
import { AuthModeState } from "./authMode.types";
import { Status } from "../../../libs/enums";

const INITIAL_STATE: AuthModeState = {
  mode: null,
  selfRegistrationEnabled: false,
  initialized: null,
  status: Status.INITIAL,
  setupStatus: Status.INITIAL,
  setupError: "",
  registerStatus: Status.INITIAL,
  registerError: "",
};

export const authModeReducer = (
  state: AuthModeState = INITIAL_STATE,
  action: any
) => {
  return produce<any>(state, (draft: AuthModeState) => {
    switch (action.type) {
      case AuthModeActions.FETCH_AUTH_MODE:
        draft.status = Status.IN_PROGRESS;
        break;
      case AuthModeActions.FETCH_AUTH_MODE_DONE:
        draft.mode = action.payload.mode;
        draft.selfRegistrationEnabled = action.payload.selfRegistrationEnabled;
        draft.status = Status.SUCCESS;
        break;
      case AuthModeActions.FETCH_AUTH_MODE_FAILED:
        draft.status = Status.ERROR;
        break;
      case AuthModeActions.FETCH_SETUP_STATUS_DONE:
        draft.initialized = action.payload.initialized;
        break;
      case AuthModeActions.PERFORM_SETUP:
        draft.setupStatus = Status.IN_PROGRESS;
        draft.setupError = "";
        break;
      case AuthModeActions.PERFORM_SETUP_DONE:
        draft.setupStatus = Status.SUCCESS;
        draft.initialized = true;
        break;
      case AuthModeActions.PERFORM_SETUP_FAILED:
        draft.setupStatus = Status.ERROR;
        draft.setupError = action.payload;
        break;
      case AuthModeActions.PERFORM_REGISTER:
        draft.registerStatus = Status.IN_PROGRESS;
        draft.registerError = "";
        break;
      case AuthModeActions.PERFORM_REGISTER_DONE:
        draft.registerStatus = Status.SUCCESS;
        break;
      case AuthModeActions.PERFORM_REGISTER_FAILED:
        draft.registerStatus = Status.ERROR;
        draft.registerError = action.payload;
        break;
    }
  });
};
