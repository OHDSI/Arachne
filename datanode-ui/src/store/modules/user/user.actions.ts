
import { UserDTOInterface } from '../../../libs/types';
import { UserActions } from './user.constants';

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
