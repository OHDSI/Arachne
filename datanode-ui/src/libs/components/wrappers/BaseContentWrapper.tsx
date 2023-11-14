
import React from 'react';
import { Grid } from '../Grid';

export const BaseContentWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Grid
      item
      xs={12}
      sx={(theme: any) => ({
        minHeight: 'inherit',
        // backgroundColor: theme.palette.backgroundColor.dark,
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      {children}
    </Grid>
  );
};
