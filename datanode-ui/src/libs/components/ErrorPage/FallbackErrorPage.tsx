import React from 'react';
import {
  MessageErrorPage,
  StatusDescription,
  StatusHeader,
} from './ErrorPage.styles';
import { Grid } from '../Grid';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button/Button';

export interface FallbackErrorPagePropsInterface {
  status: number;
  statusText: string;
  message: string;
  data: any;
  path: string;
}

export const FallbackErrorPage: React.FC<FallbackErrorPagePropsInterface> =
  props => {
    const { status, statusText, message, data, path } = props;
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        textAlign={'center'}
      >
        <Grid item xs={12}>
          <StatusHeader>{status}</StatusHeader>
          <StatusDescription>{statusText}</StatusDescription>
        </Grid>
        <Grid item xs={12}>
          <MessageErrorPage>{message}</MessageErrorPage>
          <Grid container justifyContent={'center'} spacing={2}>
            <Grid item>
              <Button
                onClick={() => {
                  window.location.href = '/';
                }}
                variant="outlined"
                size="medium"
                startIcon={<Icon iconName="list" />}
              >
                Go to home
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };
