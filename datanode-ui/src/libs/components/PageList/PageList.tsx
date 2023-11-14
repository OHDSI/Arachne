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
    // allowDelete,
    // isEnableMetadata,
    tileComponent,
    onRowClick: onRowClickOutSide,
    reloadId,
    isSilentReload,
    variant = 'secondary',
    hiddenColumns,
    // uniqName,
    dense,
  } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitial, setIsInitial] = React.useState(true);
  const fullSearch = searchParams.get('fullSearch');

  // if (!moduleConfig) {
  //   return (
  //     <SpinnerWidgetContainer>
  //       <Spinner size={70} />
  //     </SpinnerWidgetContainer>
  //   );
  // }
  const {
    disableSort,
    addButtonTitle,
    tableTitle,
    // moduleDescription,
    importButtonTitle,
    getCols,
    loadingMessage,
    rowId,
    listInitialSort,
    // createCrudMethod,
    // createFiltersPanel,
    // createSortingMethod,
    // metadataFilter,
    iconName,
  } = listConfig;


  const storageName = `dataSources`;

  // const { entityBreadcrumbs, columns: listCols } = pageListConfig;

  const useStorage: any = useLocalStorage(storageName, hiddenColumns);

  const className = React.useMemo(
    () => (tableTitle || 'entity').toLocaleLowerCase().replace(' ', '-'),
    []
  );

  // const crudMethods = React.useMemo(() => {
  //   return createCrudMethod(config?.typeContainer, config?.parentId);
  // }, [config?.parentId]);

  // const entityFilterPanel = React.useMemo(() => {
  //   return createFiltersPanel(config?.typeContainer, config?.parentId);
  // }, [config?.parentId]);

  // const entityAllowedSorting = React.useMemo(() => {
  //   return createSortingMethod(config?.typeContainer);
  // }, [config?.parentId]);

  // const { data: metaAttributes } = useMetadata(
  //   isEnableMetadata,
  //   metadataFilter,
  //   getListMetadata
  // );

  const {
    data: { tableData, filtersData },
    filters,
    allowedSorting,
    actions,
    pageCount,
    pageSize,
    getEntity,
    totalElements,
    numberOfElements,
    removeEntity,
    // updateFilters,
    setPageSize,
    status,
    error,
  } = useEntityList(
    {
      get: getDataSources,
      remove: removeDataSource,
      // getFilters: entityFilterPanel.getFilters,
      // getSorting: entityAllowedSorting,
    },
    reloadId,
    isSilentReload,
    useStorage.storage
  );

  // React.useEffect(() => {
  // dispatch(
  //   setBreadcrumbs(
  //     entityBreadcrumbs({
  //       title,
  //       path,
  //       rootPath,
  //       rootTitle,
  //     })
  //   )
  // );
  // }, []);

  // React.useEffect(() => {
  //   if (fullSearch) {
  //     updateFilters({ 'filter.search': [fullSearch || ''] });
  //   }
  //   setIsInitial(false);
  // }, [fullSearch]);


  React.useEffect(() => {
    document.title = `Prometheus Data Sources`;
  }, []);

  const onRowClick = (e: any) => {
    onRowClickOutSide ? onRowClickOutSide(e) : navigate(`${e.original[rowId]}`);
  };

  // const FILTERS_APPLIED = Object.values(filters).some(
  //   item => (item as any[])?.length > 0
  // );

  const ACTION_CELL: any = {
    Header: '',
    accessor: 'actions',
    isCropped: true,
    disableSortBy: true,
    minWidth: 80,
    width: '5%',
    Cell: (props: any) => {
      const actions = props.row.original.actions;
      // const CAN_UPDATE = React.useMemo(
      //   () =>
      //     Boolean(
      //       config?.typeContainer === TypesOfContainer.STUDY && actions
      //         ? actions?.includes(ListActions.UPDATE)
      //         : true
      //     ),
      //   [actions]
      // );
      return (
        <>
          {true ? (
            <ActionCell
              onRemove={() => removeEntity(props.row.original.id)}
              withConfirmation
              entityName={props.row.original.title || props.row.original.name}
            />
          ) : (
            <></>
          )}
        </>
      );
    },
  };

  // const columns = React.useMemo(
  //   () => [
  //     ...populateColumnsConfigWithSort(
  //       listConfig?.cols || getCols?.({ metaAttributes }) || listCols,
  //       allowedSorting
  //     ),
  //     ...(allowDelete ? [ACTION_CELL] : []),
  //   ],
  //   [allowedSorting, metaAttributes, removeEntity]
  // );

  // const CAN_CREATE = React.useMemo(
  //   () => actions?.includes(ListActions.CREATE) || isCreate,
  //   [actions]
  // );
  // const CAN_IMPORT = React.useMemo(
  //   () => actions?.includes(ListActions.IMPORT) || false,
  //   [actions]
  // );

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
          {/* {variant === 'secondary' && (
            <ListHeaderSecondary
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
          {variant === 'description' && (
            <ListHeaderDescription
              title={moduleDescription}
              canImport={isImport}
              // wrong logic
              canCreate={onCreate}
              importButtonName={importButtonTitle}
              createButtonName={addButtonTitle}
              onCreate={onCreate}
              onImport={onImport}
            />
          )} */}
        </>
      )}

      <Grid container className={'table-' + className} mt={2}>
        <Grid item xs={12}>
          <Grid container spacing={4} flexWrap="nowrap">
            {/* <Grid
              item
              className={'filters-' + className}
              sx={{
                width: {
                  md: 250,
                  lg: 280,
                  xl: 300,
                },
              }}
            >
              <FilterPanel
                showLabel
                filters={filtersData}
                value={filters}
                onChange={(key, value) => {
                  const filtersItem = { [key]: value };
                  updateFilters(filtersItem);
                  useStorage?.setStorage('filters', {
                    ...filters,
                    ...filtersItem,
                  });
                }}
                isLoading={status === Status.IN_PROGRESS}
                isReloading={status === Status.IN_PROGRESS_RELOAD}
              />
            </Grid> */}
            <Grid
              item
              sx={{
                width: {
                  md: 'calc(100% - 250px)',
                  lg: 'calc(100% - 280px)',
                  xl: 'calc(100% - 300px)',
                },
              }}
              className={'table-data-' + className}
            >
              {!isInitial && (
                <Table
                  enableSorting={!disableSort}
                  manualSortBy
                  enablePagination
                  manualPagination
                  noDataText={'No data currently available'}
                  data={tableData}
                  columns={getCols()}
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
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
