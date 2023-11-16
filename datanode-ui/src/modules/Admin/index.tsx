import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Grid } from '../../libs/components';
import { BaseInfoWrapper } from '../../libs/components/wrappers';
import { ListHeaderPrimary } from '../../libs/components/headers';
import { TabsNavigationNew } from '../../libs/components/TabsNavigation';
import { tabsAdmin } from './Admin.config';
import { setBreadcrumbs } from '../../store/modules';
import { useDispatch } from 'react-redux';
import { Databases } from './Databases';
import { Users } from './Users';
import { SystemSettings } from './SystemSettings';

export const IndexAdmin: React.FC<any> = props => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: 'Admin',
          path: ``,
        }
      ])
    );
  }, []);

  return (
    <Grid container flexDirection="column" minHeight="calc(100vh - 50px)">
      <BaseInfoWrapper>
        <ListHeaderPrimary iconName="admin" title="Administration" />
        <TabsNavigationNew tabs={tabsAdmin} withRouting />
      </BaseInfoWrapper>
      <Routes>
        <Route
          index
          element={
            <>
              <Navigate to="databases" replace />
            </>
          }
        />
        <Route path="databases/*" element={<Databases />} />
        <Route path="users/*" element={<Users />} />
        <Route path="system-settings/*" element={<SystemSettings />} />
      </Routes>
    </Grid>
  );
};