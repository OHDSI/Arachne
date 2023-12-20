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

import React, { useContext, useEffect } from "react";

import { Outlet } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { LoginPage } from "../LoginPage";
import { LayoutSpinner } from "../AppLayout/AppLayout.styles";
import { Status } from "../../libs/enums";
import { SpinnerWidgetContainer } from "../../libs/components";
import { getUser } from "../../store/modules";
import { ModalContext, UseModalContext } from "../../libs/hooks";

export const PrivateRoute: React.FC<any> = (props) => {
  const { ...passProps } = props;
  const dispatch = useDispatch();
  const getCurrentUser = () => dispatch(getUser());
  const { closeModal } = useContext<UseModalContext>(ModalContext);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const status = useSelector<any, Status>(
    (state: any) => state.user.status
  );
  const loginStatus = useSelector<any, Status>(
    (state: any) => state.user.loginStatus
  );

  useEffect(() => {
    if (status !== Status.SUCCESS) {
      closeModal();
    }
  }, [status]);

  if (status === Status.IN_PROGRESS || status === Status.INITIAL) {
    return (
      <SpinnerWidgetContainer>
        <LayoutSpinner size={70} />
      </SpinnerWidgetContainer>
    );
  }
  if (status === Status.SUCCESS) {
    return <Outlet {...passProps} />;
  }

  return <LoginPage loginStatus={loginStatus} />;
};
