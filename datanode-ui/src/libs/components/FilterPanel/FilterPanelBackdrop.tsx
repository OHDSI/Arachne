import React from 'react';
import { Skeleton } from '../Skeleton/Skeleton';
import { transparentize } from 'polished';
import { useTheme, Theme } from '@mui/material';
import { Grid } from '..';

export const FilterPanelBackdrop: React.FC<{ size: number }> = ({
  size = 6,
}) => {
  const theme = useTheme() as Theme;
  const bgcolor = transparentize(0.7, theme.palette?.secondary.main);
  const body = [];
  for (let i = 0; i < size; i++) {
    body.push(
      <Grid item xs={12} container spacing={1} key={'backdrop' + i}>
        <Grid item xs={12}>
          <Skeleton
            animation="wave"
            height={12}
            width={'40%'}
            sx={{ bgcolor }}
          />
        </Grid>
        <Grid item xs={12}>
          <Skeleton
            animation="wave"
            height={28}
            width={'100%'}
            sx={{ bgcolor }}
          />
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid container spacing={2} direction="column" mt={1}>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Skeleton
            animation="wave"
            height={28}
            width={'100%'}
            sx={{ bgcolor }}
          />
        </Grid>
      </Grid>
      {body}
    </Grid>
  );
};
