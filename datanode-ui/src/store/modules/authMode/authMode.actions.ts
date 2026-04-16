import { AuthModeActions } from "./authMode.constants";

export const fetchAuthMode = () => ({
  type: AuthModeActions.FETCH_AUTH_MODE,
});

export const fetchAuthModeDone = (data: { mode: string; selfRegistrationEnabled: boolean }) => ({
  type: AuthModeActions.FETCH_AUTH_MODE_DONE,
  payload: data,
});

export const fetchAuthModeFailed = () => ({
  type: AuthModeActions.FETCH_AUTH_MODE_FAILED,
});

export const fetchSetupStatus = () => ({
  type: AuthModeActions.FETCH_SETUP_STATUS,
});

export const fetchSetupStatusDone = (data: { initialized: boolean }) => ({
  type: AuthModeActions.FETCH_SETUP_STATUS_DONE,
  payload: data,
});

export const fetchSetupStatusFailed = () => ({
  type: AuthModeActions.FETCH_SETUP_STATUS_FAILED,
});

export const performSetup = (username: string, password: string) => ({
  type: AuthModeActions.PERFORM_SETUP,
  payload: { username, password },
});

export const performSetupDone = () => ({
  type: AuthModeActions.PERFORM_SETUP_DONE,
});

export const performSetupFailed = (error: string) => ({
  type: AuthModeActions.PERFORM_SETUP_FAILED,
  payload: error,
});

export const performRegister = (username: string, password: string) => ({
  type: AuthModeActions.PERFORM_REGISTER,
  payload: { username, password },
});

export const performRegisterDone = () => ({
  type: AuthModeActions.PERFORM_REGISTER_DONE,
});

export const performRegisterFailed = (error: string) => ({
  type: AuthModeActions.PERFORM_REGISTER_FAILED,
  payload: error,
});
