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

import { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { TabsContainer } from "./TabsNavigation.new.styles";
import { Icon } from "../Icon/Icon";

export interface TabsNavigationPropsNew {
  tabs: any;
  active?: string;
  withRouting?: boolean;
  end?: boolean;
  color?: any;
  secondary?: boolean;
}

export const TabsNavigationNew: FC<TabsNavigationPropsNew> = props => {
  const { tabs, active, withRouting, end = false, secondary = false } = props;
  const location = useLocation();
  return (
    <TabsContainer secondary={secondary}>
      {tabs.map((tab, index) =>
        withRouting ? (
          <NavLink
            end={end || tab.end}
            key={index}
            // @ts-ignore
            to={{ pathname: tab.value, search: location?.search }}
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            {({ isActive }) => (
              <>
                {tab?.iconName && (
                  <Icon
                    plain
                    iconName={tab.iconName} // for active icons + (isActive ? 'Selected' : '')
                    sx={{ fontSize: 20, mr: 0.75 }}
                  />
                )}
                <span>{tab.title}</span>
              </>
            )}
          </NavLink>
        ) : (
          <a
            key={index}
            className={active === tab.value ? "tab active" : "tab"}
            onClick={() => tab.onTabClick(tab.value)}
          >
            {tab?.iconName && (
              <Icon
                plain
                iconName={tab.iconName} // for active icons + (isActive ? 'Selected' : '')
                sx={{ fontSize: secondary ? 16 : 20, mr: 0.75 }}
              />
            )}
            <span>{tab.title}</span>
          </a>
        )
      )}
    </TabsContainer>
  );
};
