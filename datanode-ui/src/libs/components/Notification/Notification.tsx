import React, { forwardRef } from 'react';
import { Alert, AlertProps } from '@mui/material';

export type Message = {
  message?: React.ReactNode | string;
  variant?: any;
  onClose?: ((key: any) => void) | undefined;
  id?: any;
};

export type VariantType = 'default' | 'error' | 'success' | 'warning' | 'info';

export const Notification = forwardRef<HTMLDivElement, AlertProps & Message>(
  (props, ref) => {
    const onClose: any = React.useMemo(
      () => (props.onClose ? () => props.onClose(props.id) : null),
      [props.onClose, props.id]
    );

    return (
      <Alert
        ref={ref}
        severity={
          ['error', 'info', 'success', 'warning'].includes(props.variant)
            ? props.variant
            : 'success'
        }
        variant="standard"
        onClose={onClose}
        key={props.id}
      >
        {props.message}
      </Alert>
    );
  }
);
