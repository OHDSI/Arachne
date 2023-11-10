import React, { FC } from 'react';
import { Outlet } from 'react-router';
import SideNavigation from '../SideNavigation';
import {
  ContentContainer,
  LayoutContainer,
  NavigationSubContainer,
  PageContainer,
} from './AppLayout.styles';
export const AppLayout: React.FC<{ modulesSideNavigation: any }> = ({
  modulesSideNavigation,
}) => {

  return (
    <LayoutContainer>
      <SideNavigation list={modulesSideNavigation} />

      <ContentContainer>
        <NavigationSubContainer>
          {/* {currentUser?.email && (
            <>
              <Breadcrumbs />
              <UserActionsContainer>
                <UserForm onLogout={signOutUser} />
              </UserActionsContainer>
            </>
          )} */}
        </NavigationSubContainer>

        <PageContainer>
          <Outlet />
        </PageContainer>
      </ContentContainer>
    </LayoutContainer>
  );
};
