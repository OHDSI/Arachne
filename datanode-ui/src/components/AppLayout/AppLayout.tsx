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

import React from "react";
import { Outlet } from "react-router";
import SideNavigation from "../SideNavigation";
import {
  ContentContainer,
  LayoutContainer,
  NavigationSubContainer,
  PageContainer,
  UserActionsContainer,
} from "./AppLayout.styles";
import { useSelector } from "react-redux";
import { Breadcrumbs } from "../Breadcrumbs";
import { signOutUser } from "../../store/modules";
import { UserForm } from "../UserForm";

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
