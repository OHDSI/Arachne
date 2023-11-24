import { Icon, Tooltip } from '../../libs/components';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  AccountAction,
  AccountName,
  CurrentUser,
  LogoutIcon,
  UserAvatar,
} from './UserForm.styles';

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
        : '';

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
