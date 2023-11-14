
import React from 'react';
import { Grid } from '../Grid';

export const BaseEntityContent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Grid container flexGrow={1}>
      {children}
    </Grid>
  );
};
