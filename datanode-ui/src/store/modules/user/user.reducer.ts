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

import { produce } from "immer";

import { UserActions } from "./user.constants";
import { UserState } from "./user.types";
import { Status } from "../../../libs/enums";

const INITIAL_STATE: UserState = {
  data: null,
  status: Status.INITIAL,
  loginStatus: Status.INITIAL,
  errorMessage: "",
};

export const userReducer = (
  state: UserState = INITIAL_STATE,
  action: any
) => {
  return produce<any>(state, (draft: UserState) => {
    switch (action.type) {
    case UserActions.USER_SIGN_IN_REQUEST:
      draft.loginStatus = Status.IN_PROGRESS;
      break;
    case UserActions.USER_SIGN_IN_REQUEST_DONE:
      draft.data = action.payload;
      draft.loginStatus = Status.SUCCESS;
      draft.status = Status.SUCCESS;
      break;
    case UserActions.USER_SIGN_IN_REQUEST_FAILED:
      draft.data = null;
      draft.loginStatus = Status.ERROR;
      draft.errorMessage = action.payload;
      break;
    case UserActions.USER_GET_REQUEST:
      draft.status = Status.IN_PROGRESS;
      break;
    case UserActions.USER_GET_REQUEST_DONE:
      draft.data = action.payload;
      draft.status = Status.SUCCESS;
      break;
    case UserActions.USER_GET_REQUEST_FAILED:
      draft.status = Status.ERROR;
      draft.data = null;
      break;
    case UserActions.RESET_USER_DATA:
      draft.status = Status.INITIAL;
      draft.data = null;
      break;
    case UserActions.USER_SIGN_OUT_REQUEST_DONE:
      draft.status = Status.ERROR;
      draft.loginStatus = Status.INITIAL;
      draft.data = null;
      draft.errorMessage = "";
      break;
    }
  });
};
