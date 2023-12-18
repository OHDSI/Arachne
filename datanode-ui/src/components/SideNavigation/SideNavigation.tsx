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

import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  StyledButton,
  NavigationContainer,
  LogoContainer,
  InfoContainer,
} from "./SideNavigation.styles";
import { MainNavigationConfigInterface } from "../../libs/types";
import { MainMenuIcon } from "../../libs/components";
import { Tooltip, IconName } from "../../libs/components";
import { LogoArachne, LogoOHDSI, LogoOdysseus } from "../Logo";
import { mainNavigationConfig } from "./SideNavigation.config";

export const SideNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    return mainNavigationConfig(t);
  }, [t]);

  const isActive = React.useCallback(
    (path?: string) => location.pathname.split("/")[1] === path,
    [location]
  );
  return (
    <NavigationContainer>
      <LogoContainer to="/">
        <LogoArachne />
      </LogoContainer>

      {tabs.map((item: MainNavigationConfigInterface) => (
        <Tooltip placement="right" text={item.title || ""} key={item.name} show>
          <div>
            <StyledButton
              onClick={() => navigate(item.path || "")}
              variant="text"
              sx={(theme: any) => ({
                backgroundColor: isActive(item.path)
                  ? theme.palette.backgroundColor.main
                  : "",
              })}
            >
              {isActive(item.path) ? (
                <MainMenuIcon
                  iconName={(item.iconName + "Selected") as IconName}
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
