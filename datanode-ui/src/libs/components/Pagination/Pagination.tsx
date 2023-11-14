import React, { FC } from 'react';
import MuiPagination from '@mui/material/Pagination';
import type { IPaginationProps } from './Pagination.types';

export const Pagination: FC<IPaginationProps> = props => {
  const { total, onChange } = props;
  return <MuiPagination count={total} onChange={onChange} />;
};
