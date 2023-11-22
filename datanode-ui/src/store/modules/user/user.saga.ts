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
import { BaseResponceInterface, UserDTOInterface } from '../../../libs/types';

function* signInUserRequest(action: any) {
  const { userName, password } = action.payload;
  try {
    const result: BaseResponceInterface<{ token: string }> = yield call(login, userName, password);
    if (result.errorCode !== 0) throw new Error(result.errorMessage);
    yield put(userSignInDone(result.result.token));
    yield call(getUserRequest); // PRO-761 fast fix - should be deleted
  } catch (err: any) {
    console.log(err)
    let errorMessage =
      err.message === 'Bad credentials'
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
    const user: BaseResponceInterface<UserDTOInterface> = yield call(getUser);
    yield put(getUserDone(user.result));
  } catch (error) {
    yield put(getUserFailed());
  }
}


export function* userSaga() {
  yield takeLatest(UserActions.USER_SIGN_IN_REQUEST, signInUserRequest);
  yield takeLatest(UserActions.USER_SIGN_OUT_REQUEST, signOutRequest);
  yield takeLatest(UserActions.USER_GET_REQUEST, getUserRequest);
}
