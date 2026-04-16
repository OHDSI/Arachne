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

import React, { useContext, useEffect, useState } from "react";

import { Outlet } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { LoginPage } from "../LoginPage";
import { InitialSetupPage } from "../InitialSetupPage";
import { RegisterPage } from "../RegisterPage";
import { LayoutSpinner } from "../../App.styled";
import { Status } from "../../libs/enums";
import { SpinnerWidgetContainer } from "../../libs/components";
import { getUser, fetchAuthMode, fetchSetupStatus } from "../../store/modules";
import { ModalContext, UseModalContext } from "../../libs/hooks";

export const PrivateRoute: React.FC<any> = (props) => {
  const { ...passProps } = props;
  const dispatch = useDispatch();
  const { closeModal } = useContext<UseModalContext>(ModalContext);
  const [showRegister, setShowRegister] = useState(false);

  const userStatus = useSelector<any, Status>((state: any) => state.user.status);
  const loginStatus = useSelector<any, Status>((state: any) => state.user.loginStatus);
  const authModeStatus = useSelector<any, Status>((state: any) => state.authMode.status);
  const authMode = useSelector<any, string | null>((state: any) => state.authMode.mode);
  const selfRegistrationEnabled = useSelector<any, boolean>((state: any) => state.authMode.selfRegistrationEnabled);
  const initialized = useSelector<any, boolean | null>((state: any) => state.authMode.initialized);
  const setupStatus = useSelector<any, Status>((state: any) => state.authMode.setupStatus);
  const registerStatus = useSelector<any, Status>((state: any) => state.authMode.registerStatus);

  useEffect(() => {
    dispatch(fetchAuthMode());
    dispatch(fetchSetupStatus());
  }, []);

  useEffect(() => {
    // Once we know setup is done, try to get the current user (session check)
    if (initialized === true) {
      dispatch(getUser());
    }
  }, [initialized]);

  // After setup or register succeeds, the saga also fetches the user
  useEffect(() => {
    if (setupStatus === Status.SUCCESS || registerStatus === Status.SUCCESS) {
      setShowRegister(false);
    }
  }, [setupStatus, registerStatus]);

  useEffect(() => {
    if (userStatus !== Status.SUCCESS) {
      closeModal();
    }
  }, [userStatus]);

  // Still loading auth mode or setup status
  if (authModeStatus === Status.INITIAL || authModeStatus === Status.IN_PROGRESS || initialized === null) {
    return (
      <SpinnerWidgetContainer>
        <LayoutSpinner size={70} />
      </SpinnerWidgetContainer>
    );
  }

  // Not initialized and LOCAL mode → show setup page
  if (initialized === false && authMode === "LOCAL") {
    return <InitialSetupPage />;
  }

  // User is authenticated
  if (userStatus === Status.SUCCESS) {
    return <Outlet {...passProps} />;
  }

  // Checking user session
  if (userStatus === Status.IN_PROGRESS || userStatus === Status.INITIAL) {
    return (
      <SpinnerWidgetContainer>
        <LayoutSpinner size={70} />
      </SpinnerWidgetContainer>
    );
  }

  // Show register page
  if (showRegister && authMode === "LOCAL" && selfRegistrationEnabled) {
    return <RegisterPage onBackToLogin={() => setShowRegister(false)} />;
  }

  // Not authenticated → show login
  return (
    <LoginPage
      loginStatus={loginStatus}
      authMode={authMode}
      selfRegistrationEnabled={selfRegistrationEnabled}
      onShowRegister={() => setShowRegister(true)}
    />
  );
};
