import React, { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Grid } from '../../libs/components';
import { BaseInfoWrapper } from '../../libs/components/wrappers';
import { ListHeaderPrimary } from '../../libs/components/headers';
import { TabsNavigationNew } from '../../libs/components/TabsNavigation';
import { setBreadcrumbs } from '../../store/modules';
import { useDispatch } from 'react-redux';
import { Databases } from './Databases';
import { Users } from './Users';
import { SystemSettings } from './SystemSettings';
import { EnviromentsList } from './Enviroments';
import { tabsAdmin } from '../../config';

export const IndexAdmin: React.FC = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    return tabsAdmin(t);
  }, [t])

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: t('breadcrumbs.admin'),
          path: ``,
        }
      ])
    );
  }, [dispatch]);

  return (
    <Grid container flexDirection="column" minHeight="calc(100vh - 50px)">
      <BaseInfoWrapper>
        <ListHeaderPrimary iconName="admin" title={t('pages.administration.header')} />
        <TabsNavigationNew tabs={tabs} withRouting />
      </BaseInfoWrapper>
      <Routes>
        <Route
          index
          element={<Navigate to="databases" replace />}
        />
        <Route path="databases/*" element={<Databases />} />
        <Route path="users/*" element={<Users />} />
        <Route path="environments/*" element={<EnviromentsList />} />
        <Route path="system-settings/*" element={<SystemSettings />} />
      </Routes>
    </Grid>
  );
};