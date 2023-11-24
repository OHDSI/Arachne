import React from 'react';

import { pageListConfig, useLocalStorage } from './PageList.config';

import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

// import { setBreadcrumbs } from 'store/modules';
import { Status } from '../../enums';
import { Spinner, SpinnerWidgetContainer } from '../Spinner';
import { Grid } from '../Grid';
import { Table } from '../Table';
import { ErrorPage } from '../ErrorPage';
import { ActionCell } from '../cells';
import { ListHeaderPrimary } from '../headers';
import { useEntityList } from '../../hooks/useEntityList';
import { getDataSources, removeDataSource } from '../../../api/data-sources';

export interface PageListPropsInterface<I, O, C> {
  isImport?: boolean;
  isCreate?: boolean;
  onImport?: () => void;
  onCreate?: () => void;
  moduleConfig: any;
  listConfig: any;
  allowDelete?: boolean;
  tileComponent?: any;
  onRowClick?: any;
  reloadId?: string;
  isSilentReload?: boolean;
  isEnableMetadata?: boolean;
  hiddenColumns?: string[];
  variant?: 'primary' | 'secondary' | 'no-header' | 'description';
  uniqName?: string;
  dense?: boolean;
  removeId?: string;
}

export const PageList: React.FC<any> = (
  props: any
) => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const currentUser = useSelector<any, any>(
  //   (state: any) => state.user.data
  // );

  const {
    isImport,
    isCreate = false,
    onImport,
    onCreate,
    // moduleConfig,
    listConfig,
    allowDelete,
    // isEnableMetadata,
    tileComponent,
    onRowClick: onRowClickOutSide,
    reloadId,
    isSilentReload,
    variant = 'secondary',
    hiddenColumns,
    // uniqName,
    dense,
    removeId
  } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitial, setIsInitial] = React.useState(true);
  const fullSearch = searchParams.get('fullSearch');

  const {
    disableSort,
    addButtonTitle,
    tableTitle,
    // moduleDescription,
    importButtonTitle,
    getCols,
    cols,
    loadingMessage,
    rowId,
    listInitialSort,
    // createCrudMethod,
    // createFiltersPanel,
    // createSortingMethod,
    // metadataFilter,
    fetch,
    remove,
    iconName,
  } = listConfig;


  const storageName = `${tableTitle}`;

  // const { entityBreadcrumbs, columns: listCols } = pageListConfig;

  const useStorage: any = useLocalStorage(storageName, hiddenColumns);

  const className = React.useMemo(
    () => (tableTitle || 'entity').toLocaleLowerCase().replace(' ', '-'),
    []
  );

  const {
    data: { tableData },
    pageCount,
    pageSize,
    getEntity,
    totalElements,
    numberOfElements,
    removeEntity,
    status,
    error,
  } = useEntityList(
    {
      get: fetch,
      remove: remove
    },
    reloadId,
    isSilentReload,
    useStorage.storage
  );

  React.useEffect(() => {
    document.title = `Arachne Data Node - ${tableTitle}`;
  }, []);

  const onRowClick = (e: any) => {
    onRowClickOutSide ? onRowClickOutSide(e) : navigate(`${e.original[rowId]}`);
  };

  const ACTION_CELL: any = {
    Header: '',
    accessor: 'actions',
    isCropped: true,
    disableSortBy: true,
    minWidth: 80,
    width: '5%',
    Cell: (props: any) => {
      return (
        <ActionCell
          onRemove={() => removeEntity(props.row.original?.[removeId || 'id'])}
          withConfirmation
          entityName={props.row.original.title || props.row.original.name}
        />
      );
    },
  };

  const columns = React.useMemo(
    () => [
      ...cols,
      ...(allowDelete ? [ACTION_CELL] : []),
    ],
    [removeEntity]
  );

  if (status === Status.ERROR) {
    return (
      <Grid container p={6}>
        <ErrorPage {...error.response} noAction />
      </Grid>
    );
  }

  return (
    <Grid
      container
      px={dense ? 0 : 6}
      flexDirection="column"
      sx={{ backgroundColor: 'common.white', flexGrow: 1 }}
      minHeight="100%"
    >
      {variant !== 'no-header' && (
        <>
          {variant === 'primary' && (
            <ListHeaderPrimary
              iconName={iconName}
              title={tableTitle}
              canImport={isImport}
              // wrong logic
              canCreate={onCreate}
              importButtonName={importButtonTitle}
              createButtonName={addButtonTitle}
              onCreate={onCreate}
              onImport={onImport}
              count={totalElements}
            />
          )}
        </>
      )}

      <Grid container className={'table-' + className} mt={2}>
        <Grid item xs={12}>
          <Grid container spacing={4} flexWrap="nowrap">
            <Grid
              item
              xs={12}
              className={'table-data-' + className}
            >
              <Table
                enableSorting={!disableSort}
                manualSortBy
                enablePagination
                manualPagination
                noDataText={'No data currently available'}
                data={tableData}
                columns={columns}
                pageCount={pageCount}
                pageSize={pageSize}
                setPageSize={size => {
                  useStorage?.setStorage('pageSize', size);
                }}
                isLoading={
                  isSilentReload
                    ? status === Status.IN_PROGRESS
                    : status === Status.IN_PROGRESS ||
                    status === Status.IN_PROGRESS_RELOAD
                }
                isInitial={status === Status.INITIAL}
                loadingMessage={loadingMessage}
                showColumnToggle
                onRowClick={onRowClick}
                fetchData={getEntity}
                totalElements={totalElements}
                // numberOfElements={numberOfElements}
                initialSort={listInitialSort}
                tileComponent={tileComponent}
                setVisibleColumns={(columns: any[]) => {
                  useStorage.setStorage(
                    'columns',
                    columns.map(elem => elem.id)
                  );
                }}
                hiddenColumns={useStorage?.storage.columns}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
