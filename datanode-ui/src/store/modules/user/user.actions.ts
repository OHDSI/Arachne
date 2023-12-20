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

import { UserDTOInterface } from "../../../libs/types";
import { UserActions } from "./user.constants";

export const userSignIn = (userName: string, password: string) => ({
  type: UserActions.USER_SIGN_IN_REQUEST,
  payload: { userName, password },
});

export const userSignInDone = (token: string) => ({
  type: UserActions.USER_SIGN_IN_REQUEST_DONE,
  payload: token,
});

export const userSignInFailed = (errorMessage: string) => ({
  type: UserActions.USER_SIGN_IN_REQUEST_FAILED,
  payload: errorMessage,
});

export const getUser = () => ({
  type: UserActions.USER_GET_REQUEST,
});

export const getUserDone = (user: UserDTOInterface) => ({
  type: UserActions.USER_GET_REQUEST_DONE,
  payload: user,
});

export const getUserFailed = () => ({
  type: UserActions.USER_GET_REQUEST_FAILED,
});

export const userSignOut = () => ({
  type: UserActions.USER_SIGN_OUT_REQUEST,
});

export const resetUserData = () => ({
  type: UserActions.RESET_USER_DATA,
});

export const signOutUser = () => ({
  type: UserActions.USER_SIGN_OUT_REQUEST,
});

export const signOutUserDone = () => ({
  type: UserActions.USER_SIGN_OUT_REQUEST_DONE,
});

export const signOutUserFailed = (e: any) => ({
  type: UserActions.USER_SIGN_OUT_REQUEST_FAILED,
  payload: e
});

export const switchTenant = (tenantId: string) => ({
  type: UserActions.SWITCH_TENANT,
  payload: { tenantId },
});
