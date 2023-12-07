
import React, { FC } from 'react';
import { Grid } from '../Grid';

export const BaseInfoWrapper: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Grid
      item
      xs={12}
      sx={(theme: any) => ({
        boxShadow: theme.customShadows[2],
        background: '#ffffff',
        zIndex: 4,
        px: 3,
      })}
    >
      {children}
    </Grid>
  );
};
