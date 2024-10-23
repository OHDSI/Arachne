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

import { Icon, Tooltip } from "../../libs/components";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AccountAction,
  AccountName,
  CurrentUser,
  LogoutIcon,
  UserAvatar,
} from "./UserForm.styles";

export const UserForm: React.FC<{
  onLogout: () => any;
  onContextSwitch?: (tenantId: string) => any;
  showMenu?: boolean;
}> = ({ onLogout }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: { user: { data: any } }) => state.user.data
  );


  const userName =
    currentUser.firstname && currentUser.lastname
    	? `${currentUser.firstname} ${currentUser.lastname}`
    	: currentUser.username
    		? currentUser.username
    		: "";

  const logout = (): void => {
    dispatch(onLogout());
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {

  };


  return (
    <>
      <AccountName>
        <AccountAction onClick={handleClick}>
          <UserAvatar>
            {currentUser.firstname?.[0] + currentUser.lastname?.[0]}
          </UserAvatar>
          <CurrentUser>{userName}</CurrentUser>
        </AccountAction>
        <Tooltip text="logout">
          <LogoutIcon onClick={logout}>
            <Icon iconName="logout" color="primary" />
          </LogoutIcon>
        </Tooltip>
      </AccountName>
    </>
  );
};
