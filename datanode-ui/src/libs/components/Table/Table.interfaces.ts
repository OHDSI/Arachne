import React from 'react';
import { CellProps, Column as TableColumn, Row } from 'react-table';

export type TableProps = {
  // data props
  data: Array<any>;
  columns: Array<Column>;
  rowIdSelector?: string;
  // table configuration props
  enableRowSelect?: boolean;
  disablePageSize?: boolean;
  enableSorting?: boolean;
  manualSortBy?: boolean;
  enablePagination?: boolean;
  manualPagination?: boolean;
  paginationPosition?: 'top' | 'bottom' | 'both';
  showColumnToggle?: boolean;
  pageNumber?: number;
  pageSize?: number;
  pageCount?: number;
  isLoading?: boolean;
  loadingMessage?: string;
  noDataText?: string;
  initialSort?: {
    desc: boolean;
    id: string;
  };
  // table actions
  fetchData?: (pageIndex?: number, pageSize?: number, sortBy?: any) => void;
  onEdit?: (data: {
    rowIndex?: number;
    columnId?: string;
    value: any;
    row?: any;
  }) => void;
  onRowSelect?: (
    selectedRowIds: { [key: number]: boolean },
    rows?: any,
    flag?: boolean
  ) => void;
  disableRowClick?: (row: Row<any>) => boolean;
  onRowClick?: (row: Row<any>) => void;
  setPageSize?: (size: number) => void;
  setPageNumber?: (num: number) => void;
  setSort?: (sort: { id: any; desc: boolean }) => void;
  setCurrentPage?: (pageData: any[]) => void;
  setVisibleColumns?: (columns: any[]) => void;
  // other
  className?: string;
  totalElements?: number;
  numberOfElements?: number;
  selectedRowIds?: any;
  selectedElements?: any;
  immutableColumns?: Array<string>;
  tileComponent?: React.ReactNode | React.FC<any>;
  isInitial?: boolean;
  hiddenColumns?: string[];
  tileView?: boolean;
};

export type Column<T extends object = {}> = TableColumn<T> & {
  isCropped?: boolean;
  disableSortBy?: boolean;
};
