import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { TabContainer, TabsContainer } from './TabsNavigation.styles';
import { Grid } from '../Grid';

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
                    navData.isActive ? 'item-tab active' : 'item-tab'
                  }
                  to={(tab as any).path}
                >
                  {tab.title}
                </NavLink>
              ) : (
                <a
                  className={
                    active === (tab as any).id
                      ? 'item-tab active'
                      : 'item-tab'
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
