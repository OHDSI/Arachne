import { FC, useContext, useEffect, useState } from 'react';

import { ModalContext, UseModalContext, useSystemSettings } from '../../../libs/hooks';
import { useDispatch } from 'react-redux';
import { setBreadcrumbs } from '../../../store/modules';
import { Status } from '../../../libs/enums';
import { Block, ContentBlock, FormElement, Grid, Input, SecondaryContentWrapper, Spinner, SpinnerContainer, TabsNavigationNew, useNotifications } from '../../../libs/components';
import { Divider } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router';
import { BlockSettings } from './BlockSettings';


export const SystemSettings: FC<any> = ({ root }) => {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useNotifications()

  const {
    settings,
    status,
    editSystemSettings
  } = useSystemSettings();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: 'Admin',
          path: ``,
        },
        {
          name: 'System Settings',
          path: `/system-settings`,
        },
      ])
    );
  }, []);

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
  }, [status])

  if (status === Status.INITIAL || status === Status.IN_PROGRESS_RELOAD) {
    return (
      <SpinnerContainer>
        <Spinner size={62} />
      </SpinnerContainer>
    );
  }

  return (
    <Grid container spacing={2} px={6}>
      <Grid item xs={12}>
        <TabsNavigationNew tabs={settings.map(elem => ({ value: elem.name, title: elem.label }))} withRouting secondary />
        <Divider />
      </Grid>
      <Grid item xs={12} py={3}>
        <SecondaryContentWrapper>
          <Routes>
            <Route
              index
              element={
                <>
                  <Navigate to="integration" replace />
                </>
              }
            />
            {settings.map(setting => (
              <Route
                path={setting.name}
                element={
                  <BlockSettings onEdit={editSystemSettings} setting={setting} isLoading={status === Status.IN_PROGRESS} />
                }
              />
            ))}

          </Routes>
        </SecondaryContentWrapper>
      </Grid>
    </Grid>
  );
};
