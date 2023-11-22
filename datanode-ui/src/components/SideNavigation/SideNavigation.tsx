import React, { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  StyledButton,
  NavigationContainer,
  LogoContainer,
  InfoContainer,
} from './SideNavigation.styles';

import { Logo } from '../Logo/Logo';
import { MainMenuIcon } from '../../libs/components/Icon/MainMenuIcon';
import { IconName } from '../../libs/components/Icon/Icon';
import { Tooltip } from '../../libs/components';
import { LogoArachne } from '../Logo/LogoArachneVertical';
import { LogoOHDSI } from '../Logo/LogoOHDSIVerical';
import { LogoOdysseus } from '../Logo/LogoOdysesusVertical';

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
        <LogoArachne />
      </LogoContainer>

      {list?.map((item: any) => (
        <Tooltip placement="right" text={item.title || ''} key={item.name} show>
          <div>
            <StyledButton
              onClick={() => navigate(item.path || '')}
              variant="text"
              sx={(theme: any) => ({
                backgroundColor: isActive(item.path)
                  ? theme.palette.backgroundColor.main
                  : '',
              })}
            >
              {isActive(item.path) ? (
                <MainMenuIcon
                  iconName={(item.iconName + 'Selected') as IconName}
                />
              ) : (
                <MainMenuIcon iconName={item.iconName as IconName} />
              )}
            </StyledButton>
          </div>
        </Tooltip>
      ))}
      <InfoContainer>
        <LogoOHDSI />
        <LogoOdysseus />
      </InfoContainer>
    </NavigationContainer>
  );
};
