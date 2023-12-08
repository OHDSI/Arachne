import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { useDispatch } from 'react-redux';
import { Divider } from '@mui/material';

import { useSystemSettings } from '../../../libs/hooks';
import { setBreadcrumbs } from '../../../store/modules';
import { Status } from '../../../libs/enums';
import {
  Grid,
  SecondaryContentWrapper,
  Spinner,
  SpinnerContainer,
  TabsNavigationNew,
  useNotifications
} from '../../../libs/components';

import { BlockSettings } from './BlockSettings';
import { TabsInterface } from '@/libs/types';


export const SystemSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useNotifications()

  const {
    settings,
    status,
    editSystemSettings
  } = useSystemSettings();

  const createTabs = (values: any): TabsInterface[] => values.map(elem => ({ value: elem.name, title: elem.label }))

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: 'Admin',
          path: `/administration`,
        },
        {
          name: 'System Settings',
          path: `/administration/system-settings`,
        },
      ])
    );
  }, [dispatch]);

  useEffect(() => {
    if (status === Status.SUCCESS) {
      enqueueSnackbar({
        message: `Settings successfully edited`,
        variant: 'success',
      } as any);
    }

    if (status === Status.ERROR) {
      enqueueSnackbar({
        message: `Oops something wrong`,
        variant: 'error',
      } as any);
    }
  }, [status, enqueueSnackbar])

  if (status === Status.INITIAL || status === Status.IN_PROGRESS_RELOAD) {
    return (
      <SpinnerContainer>
        <Spinner size={62} />
      </SpinnerContainer>
    );
  }

  return (
    <Grid container spacing={2} px={3}>
      <Grid item xs={12}>
        <TabsNavigationNew tabs={createTabs(settings)} withRouting secondary />
        <Divider />
      </Grid>
      <Grid item xs={12} py={3}>
        <SecondaryContentWrapper>
          <Routes>
            <Route
              index
              element={<Navigate to="integration" replace />}
            />
            {settings.map(setting => (
              <Route
                path={setting.name}
                element={
                  <BlockSettings
                    onEdit={editSystemSettings}
                    setting={setting}
                    isLoading={status === Status.IN_PROGRESS}
                  />
                }
              />
            ))}

          </Routes>
        </SecondaryContentWrapper>
      </Grid>
    </Grid>
  );
};
