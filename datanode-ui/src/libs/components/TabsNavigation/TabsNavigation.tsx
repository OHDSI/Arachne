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
import { NavLink } from "react-router-dom";

import { TabContainer, TabsContainer } from "./TabsNavigation.styles";
import { Grid } from "../Grid";

export interface TabsNavigationPropsInterface {
  tabs: any;
  active?: string;
  local?: boolean;
}

export const TabsNavigation: FC<TabsNavigationPropsInterface> = props => {
  const { tabs, active, local } = props;
  return (
    <Grid container>
      <Grid item xs={12}>
        <TabsContainer>
          {tabs.map((tab, index) => (
            <TabContainer key={index}>
              {!local ? (
                <NavLink
                  end
                  className={navData =>
                    navData.isActive ? "item-tab active" : "item-tab"
                  }
                  to={(tab as any).path}
                >
                  {tab.title}
                </NavLink>
              ) : (
                <a
                  className={
                    active === (tab as any).id
                      ? "item-tab active"
                      : "item-tab"
                  }
                  onClick={() =>
                    (tab as any).onTab(
                      (tab as any).id
                    )
                  }
                >
                  {tab.title}
                </a>
              )}
            </TabContainer>
          ))}
        </TabsContainer>
      </Grid>
    </Grid>
  );
};
