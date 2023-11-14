import React, { FC, useEffect, useCallback } from 'react';
import {
  useExpanded,
  usePagination,
  useSortBy,
  useTable,
  useRowSelect,
} from 'react-table';
import { EmptyTableStub } from '../EmptyTableStub';
import { Checkbox } from '../Checkbox/Checkbox';
import { ColumnSelect } from './ColumnSelect/ColumnSelect';
import { CustomTableComponent } from './CustomTableComponent/CustomTableComponent';
import { Pagination } from './Pagination/Pagination';
import { TableProps } from './Table.interfaces';
import { Container, TableActions, TableContainer } from './Table.styles';
import { TableComponent } from './TableComponent/TableComponent';
import { TableSpinner } from './TableSpinner/TableSpinner';
import _, { isEqual } from 'lodash';

export const Table: FC<TableProps> = props => {
  const {
    enableSorting = false,
    enablePagination = false,
    disablePageSize = false,
    paginationPosition = 'bottom',
    manualPagination = false,
    manualSortBy = false,
    pageCount: defaultPageCount,
    pageSize: defaultPageSize,
    pageNumber,
    isLoading = false,
    loadingMessage = '',
    fetchData,
    onEdit,
    showColumnToggle = false,
    enableRowSelect = false,
    rowIdSelector,
    onRowSelect,
    onRowClick,
    disableRowClick,
    setPageSize: setManualPageSize,
    setPageNumber,
    setSort,
    setCurrentPage,
    setVisibleColumns,
    noDataText = 'No data currently available',
    className,
    totalElements,
    numberOfElements,
    initialSort,
    selectedRowIds: defaultSelectedRowIds,
    immutableColumns,
    tileComponent,
    isInitial,
    hiddenColumns,
    tileView,
  } = props;

  // custom reducer to fix existing issue https://github.com/TanStack/table/issues/3142
  const reducer = (newState, action) => {
    if (action.type === 'deselectAllRows') {
      return { ...newState, selectedRowIds: {} };
    }
    return newState;
  };

  const selectedIds = React.useMemo(() => {
    const ids = defaultSelectedRowIds
      ? Object.keys(defaultSelectedRowIds)
      : undefined;

    return ids?.length ? ids.map(item => ({ [item]: true })) : undefined;
  }, [defaultSelectedRowIds]);

  const sort = React.useMemo(() => initialSort, [initialSort]);

  const options = {
    stateReducer: reducer,
    columns: props.columns,
    data: props.data,
    disableSortBy: !enableSorting,
    onEdit,
    initialState: {
      pageIndex: pageNumber || 0,
      pageSize: defaultPageSize || 10,
      ...(sort && { sortBy: [sort] }),
      ...(selectedIds && { selectedRowIds: selectedIds }),
      hiddenColumns: hiddenColumns || [],
    },
    manualPagination,
    manualSortBy,
    getRowId: (row, relativeIndex, parent) => {
      if (rowIdSelector) {
        if (row[rowIdSelector] != null) {
          return row[rowIdSelector];
        } else {
          return row.id || relativeIndex;
        }
      } else {
        return parent ? [parent.id, relativeIndex].join('.') : relativeIndex;
      }
    },
    autoResetSelectedRows: false,
    ...(defaultPageCount && { pageCount: defaultPageCount }),
    autoResetPage: false,
  };

  const withRowSelection = (hooks: any) => {
    hooks.visibleColumns.push((columns: any) => [
      // selection column
      {
        id: 'selection',
        Header: ({ getToggleAllPageRowsSelectedProps }: any) => {
          return (
            <Checkbox
              stopPropagation
              size="small"
              {...getToggleAllPageRowsSelectedProps()}
            />
          );
        },
        Cell: ({ row }: any) => {
          return (
            <Checkbox
              stopPropagation
              size="small"
              {...row.getToggleRowSelectedProps()}
            />
          );
        },
      },
      ...columns,
    ]);
  };

  const hooks = [
    useSortBy,
    useExpanded,
    usePagination,
    ...(enableRowSelect ? [useRowSelect, withRowSelection] : []),
  ];

  const {
    dispatch,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    setPageSize,
    allColumns,
    visibleColumns,
    getToggleHideAllColumnsProps,
    state: { pageIndex, pageSize, sortBy, selectedRowIds },
    selectedFlatRows,
    setSortBy,
  } = useTable(options as any, ...hooks) as any; // TODO: Figure out why typescript error

  useEffect(() => {
    if (!selectedIds) dispatch({ type: 'deselectAllRows' });
  }, [selectedIds]);

  useEffect(() => {
    if (page.length > 0) {
      const visibleColumnKeys = visibleColumns.map(elem => elem.id);
      setVisibleColumns?.(
        allColumns.filter(elem => !visibleColumnKeys.includes(elem.id))
      );
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (!manualSortBy && sort && !isEqual([sort], [sortBy])) {
      setSortBy([sort]);
    }
  }, [sort]);

  useEffect(() => {
    page && setCurrentPage?.(page?.map(item => item.original));
  }, [pageIndex, pageSize, setCurrentPage, page]);

  useEffect(() => {
    const [sort] = sortBy;
    setSort?.(sort);
    fetchData?.(pageIndex, pageSize, sort);
  }, [fetchData, pageIndex, pageSize, ...(manualSortBy ? [sortBy] : [])]);

  useEffect(() => {
    defaultPageSize && setPageSize(defaultPageSize);
  }, [defaultPageSize]);

  useEffect(() => {
    const data = selectedFlatRows?.map(row => row.original);
    onRowSelect?.(data, selectedRowIds);
  }, [onRowSelect, selectedRowIds]);

  const goToPageNum = useCallback((pageNum: number) => {
    gotoPage(pageNum);
    setPageNumber?.(pageNum);
  }, []);

  const setPageSizeOption = useCallback((size: number) => {
    setPageSize(size);
    setManualPageSize?.(size);
  }, []);

  useEffect(() => {
    if (totalElements > 0 && props.data?.length === 0 && pageIndex > 0) {
      // const num = Math.ceil(totalElements / pageSize) - 1 || 0;
      // console.log('navigate to page with data:', num);
      gotoPage(0);
    }
  }, [pageIndex, pageSize, props.data]);

  const composeTableView = () => {
    const table = (
      <TableContainer key={'table-template'} isLoading={isLoading}>
        {!tileComponent ? (
          <TableComponent
            getTableProps={getTableProps}
            getTableBodyProps={getTableBodyProps}
            headerGroups={headerGroups}
            prepareRow={prepareRow}
            page={page}
            onRowClick={onRowClick}
            disableRowClick={disableRowClick}
            columnsCnt={visibleColumns.length}
            noDataText={noDataText}
            enableSorting={enableSorting}
            tileView={tileView}
          />
        ) : (
          <CustomTableComponent
            prepareRow={prepareRow}
            page={page}
            onRowClick={onRowClick}
            tileComponent={tileComponent}
          />
        )}
      </TableContainer>
    );
    const actions = (number: number) => {
      return (
        <TableActions key={'table-actions' + number} className="table-actions">
          <div>
            {!tileComponent && (
              <ColumnSelect
                allColumns={allColumns}
                immutableColumns={immutableColumns}
                showColumnToggle={showColumnToggle}
                getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
              />
            )}
          </div>
          <Pagination
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            pageOptions={pageOptions}
            pageCount={pageCount}
            gotoPage={goToPageNum}
            nextPage={() => canNextPage && goToPageNum(pageIndex + 1)}
            previousPage={() => canPreviousPage && goToPageNum(pageIndex - 1)}
            setPageSize={setPageSizeOption}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalElements={totalElements}
            numberOfElements={page?.length}
            disablePageSize={disablePageSize}
          />
        </TableActions>
      );
    };
    const components: React.ReactNode[] = [table];
    if (enablePagination) {
      components.unshift(actions(1));
      components.push(actions(2));
      paginationPosition === 'top' && components.pop();
      paginationPosition === 'bottom' && components.shift();
    }
    return components;
  };

  return (
    <Container
      className={'c-table ' + (className || '')}
      paginationPosition={paginationPosition}
    >
      <TableSpinner isLoading={isLoading} loadingMessage={loadingMessage} />
      {(isInitial || page?.length === 0) && !isLoading ? (
        <EmptyTableStub noDataText={noDataText} />
      ) : (
        composeTableView()
      )}
    </Container>
  );
};
