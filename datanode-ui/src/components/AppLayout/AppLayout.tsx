import React from 'react';
import { Outlet } from 'react-router';
import SideNavigation from '../SideNavigation';
import {
  ContentContainer,
  LayoutContainer,
  NavigationSubContainer,
  PageContainer,
  UserActionsContainer,
} from './AppLayout.styles';
import { useSelector } from 'react-redux';
import { Breadcrumbs } from '../Breadcrumbs';
import { signOutUser } from '../../store/modules';
import { UserForm } from '../UserForm';

export const AppLayout: React.FC = () => {

  const currentUser = useSelector<any, any>(state => state.user.data);

  return (
    <LayoutContainer>
      <SideNavigation />

      <ContentContainer>
        <NavigationSubContainer>
          {currentUser?.username && (
            <>
              <Breadcrumbs />
              <UserActionsContainer>
                <UserForm onLogout={signOutUser} />
              </UserActionsContainer>
            </>
          )}
        </NavigationSubContainer>

        <PageContainer>
          <Outlet />
        </PageContainer>
      </ContentContainer>
    </LayoutContainer>
  );
};
