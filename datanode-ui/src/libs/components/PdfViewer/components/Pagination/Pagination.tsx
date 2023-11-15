import React, { FC } from 'react';
import { PaginationContainer } from './Pagination.styles';
import { Pagination as BasicPagination } from '../../../Pagination';
import { IPaginationProps } from './Pagination.types';

export const Pagination: FC<IPaginationProps> = props => {
  const { totalPages, onChange } = props;
  return (
    <PaginationContainer>
      <BasicPagination total={totalPages} onChange={onChange} />
    </PaginationContainer>
  );
};
