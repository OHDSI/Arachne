import { SnackbarProvider, SnackbarProviderProps } from 'notistack';
import React from 'react';
import { Notification } from './Notification';
import { classes } from './Notification.styles';

export const NotificationsProvider: React.FC<SnackbarProviderProps> = props => {
  return (
    <SnackbarProvider
      maxSnack={props.maxSnack}
      anchorOrigin={props.anchorOrigin}
      classes={{
        containerRoot: classes.root,
      }}
      Components={{
        default: Notification,
        success: Notification,
        error: Notification,
        info: Notification,
        warning: Notification,
      }}
    >
      {props.children}
    </SnackbarProvider>
  );
};
