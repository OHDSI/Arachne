import { CircularProgress, CircularProgressProps } from '@mui/material';
import React from 'react';

export const Spinner: React.FC<CircularProgressProps> = props => {
  return <CircularProgress {...props} />;
};

