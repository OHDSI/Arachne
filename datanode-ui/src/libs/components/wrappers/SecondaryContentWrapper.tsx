
import React, { FC, ReactNode } from 'react';
import { Grid } from '../Grid';

export const SecondaryContentWrapper: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  return (
    <Grid item xs={12} bgcolor="backgroundColor.dark" p={2} borderRadius={1}>
      {children}
    </Grid>
  );
};
