import clsx from 'clsx';
import React, { useMemo } from 'react';
import {
  PaginationStyled,
  ButtonStyled,
  StyledSelect,
} from './Pagination.styles';

export interface PaginationProps {
  pageCount: number;
  pageOptions: number[];
  canPreviousPage: boolean;
  canNextPage: boolean;
  gotoPage: (item: any) => void;
  previousPage: () => void;
  nextPage: () => void;
  setPageSize?: (pageSize: number) => void;
  pageIndex: number;
  pageSize?: number;
  className?: string;
  totalElements?: number;
  numberOfElements?: number;
  disablePageSize?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  pageOptions,
  canPreviousPage,
  canNextPage,
  gotoPage,
  previousPage,
  nextPage,
  setPageSize,
  pageIndex,
  pageSize,
  className,
  totalElements,
  numberOfElements,
  disablePageSize,
}) => {
  const populatePagesList = () => {
    const list: React.ReactNode[] = [];
    let arr: any[] = [];
    if (pageCount > 5) {
      arr = [1, 2, 3, '...', pageCount];
      if (pageIndex > 1 && pageIndex + 2 < pageCount) {
        arr = [
          1,
          '...',
          pageIndex,
          pageIndex + 1,
          pageIndex + 2,
          '...',
          pageCount,
        ];
      } else if (pageIndex >= pageCount - 3 && pageIndex + 1 <= pageCount) {
        arr = [1, '...', pageCount - 2, pageCount - 1, pageCount];
      }
    } else {
      for (let index = 0; index < pageCount; index++) {
        arr[index] = index + 1;
      }
    }

    arr.forEach((item, i) =>
      list.push(
        typeof item === 'string' ? (
          <div className="dots" key={i + '-pagination-dots'}>
            {item}
          </div>
        ) : (
          <ButtonStyled
            onClick={() => gotoPage(item - 1)}
            disabled={pageCount < item}
            size="xsmall"
            fullWidth={false}
            variant="text"
            key={i + '-pagination-btn'}
            className={`pagination-button ${
              item === pageIndex + 1 ? 'active' : ''
            }`}
          >
            {item}
          </ButtonStyled>
        )
      )
    );
    return list;
  };

  const entries = useMemo(() => {
    return ` (Showing ${pageIndex * pageSize + 1} to ${
      pageIndex * pageSize + numberOfElements
    } of ${totalElements} entries)`;
  }, [pageIndex, numberOfElements, totalElements]);

  return (
    <PaginationStyled className={clsx(className, 'table-pagination')}>
      <ButtonStyled
        size="xsmall"
        variant="text"
        fullWidth={false}
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
      >
        {'<'}
        {/* {'Previous'} */}
      </ButtonStyled>
      {populatePagesList()}
      <ButtonStyled
        size="xsmall"
        variant="text"
        fullWidth={false}
        onClick={() => nextPage()}
        disabled={!canNextPage}
      >
        {'>'}
        {/* {'Next'} */}
      </ButtonStyled>

      <span>{`Page ${pageIndex + 1} of ${pageOptions.length}`}</span>
      <span style={{ marginRight: 10 }}>{numberOfElements > 0 && entries}</span>
      {!disablePageSize && (
        <StyledSelect
          size="small"
          value={pageSize}
          onChange={(e: any) => {
            setPageSize && setPageSize(e);
          }}
          options={[10, 15, 20, 25, 50, 75, 100].map(value => ({
            name: 'Show ' + value,
            value,
          }))}
          name="pageSize"
          fullWidth={false}
        />
      )}
    </PaginationStyled>
  );
};
