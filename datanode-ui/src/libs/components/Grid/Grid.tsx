import React from 'react';
import { Grid as UIGrid, GridProps as UIGridProps } from '@mui/material';

export type GridProps = UIGridProps;
export const Grid: React.FC<GridProps> = props => {
  return <UIGrid {...props}>{props.children}</UIGrid>;
};
