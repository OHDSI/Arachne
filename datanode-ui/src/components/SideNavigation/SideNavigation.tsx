import React, { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  StyledButton,
  NavigationContainer,
  LogoContainer,
} from './SideNavigation.styles';

import { Logo } from '../Logo/Logo';

export const SideNavigation: FC<any> = props => {
  const { list } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = React.useCallback(
    (path?: string) => location.pathname.split('/')[1] == path,
    [location]
  );
  return (
    <NavigationContainer>
      <LogoContainer to="/">
        <Logo />
      </LogoContainer>

      {list?.map((item: any) => (
        <StyledButton
          onClick={() => navigate(item.path || '')}
          variant="text"
          sx={(theme: any) => ({
            backgroundColor: isActive(item.path)
              ? theme.palette.backgroundColor.main
              : '',
          })}
        >
          {item.name}
        </StyledButton>
      ))}
    </NavigationContainer>
  );
};
