import { call, put, takeLatest } from "redux-saga/effects";
import { getAuthMode, getSetupStatus, postSetup, register } from "../../../api/auth";
import { getUser } from "../../../api/auth";
import {
  fetchAuthModeDone,
  fetchAuthModeFailed,
  fetchSetupStatusDone,
  fetchSetupStatusFailed,
  performSetupDone,
  performSetupFailed,
  performRegisterDone,
  performRegisterFailed,
} from "./authMode.actions";
import { getUserDone, getUserFailed } from "../user/user.actions";
import { AuthModeActions } from "./authMode.constants";

function* fetchAuthModeRequest() {
  try {
    const result: { mode: string; selfRegistrationEnabled: boolean } = yield call(getAuthMode);
    yield put(fetchAuthModeDone(result));
  } catch {
    yield put(fetchAuthModeFailed());
  }
}

function* fetchSetupStatusRequest() {
  try {
    const result: { initialized: boolean } = yield call(getSetupStatus);
    yield put(fetchSetupStatusDone(result));
  } catch {
    yield put(fetchSetupStatusFailed());
  }
}

function* performSetupRequest(action: any) {
  const { username, password } = action.payload;
  try {
    yield call(postSetup, username, password);
    yield put(performSetupDone());
  } catch (err: any) {
    const message = err?.response?.data?.error || err?.response?.data?.errors?.join(", ") || "Setup failed";
    yield put(performSetupFailed(message));
    return;
  }
  // Auto-login after successful setup (separate error handling)
  try {
    const user: any = yield call(getUser);
    yield put(getUserDone(user));
  } catch {
    yield put(getUserFailed());
  }
}

function* performRegisterRequest(action: any) {
  const { username, password } = action.payload;
  try {
    yield call(register, username, password);
    yield put(performRegisterDone());
  } catch (err: any) {
    const message = err?.response?.data?.error || err?.response?.data?.errors?.join(", ") || "Registration failed";
    yield put(performRegisterFailed(message));
    return;
  }
  // Auto-login after successful registration (separate error handling)
  try {
    const user: any = yield call(getUser);
    yield put(getUserDone(user));
  } catch {
    yield put(getUserFailed());
  }
}

export function* authModeSaga() {
  yield takeLatest(AuthModeActions.FETCH_AUTH_MODE, fetchAuthModeRequest);
  yield takeLatest(AuthModeActions.FETCH_SETUP_STATUS, fetchSetupStatusRequest);
  yield takeLatest(AuthModeActions.PERFORM_SETUP, performSetupRequest);
  yield takeLatest(AuthModeActions.PERFORM_REGISTER, performRegisterRequest);
}
