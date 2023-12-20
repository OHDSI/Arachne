/*
 *
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { getUser, logout, login } from "../../../api/auth";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  getUserDone,
  getUserFailed,
  signOutUserDone,
  signOutUserFailed,
  userSignInDone,
  userSignInFailed,
} from "./user.actions";
import { UserActions } from "./user.constants";
import { UserDTOInterface } from "../../../libs/types";

function* signInUserRequest(action: any) {
  const { userName, password } = action.payload;
  try {
    const result: { token: string } = yield call(login, userName, password);
    yield put(userSignInDone(result.token));
    yield call(getUserRequest);
  } catch (err: any) {
    const errorMessage = err.message === "Bad credentials"
      ? "Wrong user name or password."
      : `An error has occurred: ${err?.response.status}.`;
    yield put(userSignInFailed(errorMessage));
  }
}

function* signOutRequest() {
  try {
    yield call(logout);
    yield put(signOutUserDone());
  } catch (err) {
    yield put(signOutUserFailed(err));
  }
}

function* getUserRequest() {
  try {
    const user: UserDTOInterface = yield call(getUser);
    yield put(getUserDone(user));
  } catch (error) {
    yield put(getUserFailed());
  }
}


export function* userSaga() {
  yield takeLatest(UserActions.USER_SIGN_IN_REQUEST, signInUserRequest);
  yield takeLatest(UserActions.USER_SIGN_OUT_REQUEST, signOutRequest);
  yield takeLatest(UserActions.USER_GET_REQUEST, getUserRequest);
}
