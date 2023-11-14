import { produce } from 'immer';

import { UserActions } from './user.constants';
import { UserState } from './user.types';
import { Status } from '../../../libs/enums';

const INITIAL_STATE: UserState = {
  data: null,
  status: Status.INITIAL,
  loginStatus: Status.INITIAL,
  errorMessage: '',
};

export const userReducer = (
  state: UserState = INITIAL_STATE,
  action: any
) => {
  // @ts-ignore
  return produce<any>(state, (draft: UserState) => {
    switch (action.type) {
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
        draft.data = action.payload.user;
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
        draft.errorMessage = '';
        break;
    }
  });
};
