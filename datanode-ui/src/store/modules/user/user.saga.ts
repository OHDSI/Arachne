import { getUser, logout, login } from '../../../api/auth';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  getUserDone,
  getUserFailed,
  signOutUserDone,
  userSignInDone,
  userSignInFailed,
} from './user.actions';
import { UserActions } from './user.constants';

interface Generic {
  config?: any,
  data?: any,
  headers?: any,
  request?: any,
  status?: number,
  statusText?: string
}

function* signInUserRequest(action: any) {
  const { userName, password } = action.payload;
  try {
    const user: Generic = yield call(login, userName, password);
    yield put(userSignInDone(user));
    yield call(getUserRequest); // PRO-761 fast fix - should be deleted
  } catch (err: any) {
    let errorMessage =
      err?.response.status === 401
        ? 'Wrong user name or password.'
        : `An error has occurred: ${err?.response.status}.`;
    yield put(userSignInFailed(errorMessage));
  }
}

function* signOutRequest() {
  try {
    yield call(logout);
    yield put(signOutUserDone());
  } catch (err) {
    console.error(err);
  }
}

function* getUserRequest() {
  try {
    const user: Generic = yield call(getUser);
    console.log(user)
    yield put(getUserDone({ user }));
  } catch (error) {
    yield put(getUserFailed());
  }
}


export function* userSaga() {
  yield takeLatest(UserActions.USER_SIGN_IN_REQUEST, signInUserRequest);
  yield takeLatest(UserActions.USER_SIGN_OUT_REQUEST, signOutRequest);
  yield takeLatest(UserActions.USER_GET_REQUEST, getUserRequest);
}
