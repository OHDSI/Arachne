/*
 *
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import React from "react";

import { pageListConfig, useLocalStorage } from "./PageList.config";

import { useNavigate } from "react-router";

import { Status } from "../../enums";

import { Grid } from "../Grid";
import { Table } from "../Table";
import { ErrorPage } from "../ErrorPage";
import { ActionCell } from "../cells";
import { ListHeaderPrimary } from "../headers";
import { useEntityList } from "../../hooks/useEntityList";

import { ColumnInterface } from "../../types";

export interface PageListPropsInterface<I, O, C> {
  onImport?: () => void;
  onCreate?: () => void;
  onReload?: (id: string) => void;
  moduleConfig: any;
  listConfig: any;
  allowDelete?: boolean;
  allowRerun?: boolean;
  tileComponent?: any;
  onRowClick?: any;
  reloadId?: string;
  isSilentReload?: boolean;
  isEnableMetadata?: boolean;
  hiddenColumns?: string[];
  variant?: "primary" | "secondary" | "no-header" | "description";
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
    onImport,
    onCreate,
    onReload,
    listConfig,
    allowDelete,
    tileComponent,
    onRowClick: onRowClickOutSide,
    reloadId,
    isSilentReload,
    variant = "secondary",
    hiddenColumns,
    allowRerun,
    dense,
    removeId,
    isCancel,
    onRemove,
  } = props;

  const {
    disableSort,
    addButtonTitle,
    tableTitle,
    importButtonTitle,
    cols,
    loadingMessage,
    rowId,
    listInitialSort,
    fetch,
    remove,
    iconName,
  } = listConfig;


  const storageName = `${tableTitle}`;

  const useStorage: any = useLocalStorage(storageName, hiddenColumns);

  const className = React.useMemo(
    () => (tableTitle || "entity").toLocaleLowerCase().replace(" ", "-"),
    []
  );

  const {
    data: { tableData },
    pageCount,
    pageSize,
    getEntity,
    totalElements,
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
    console.log(e);
    onRowClickOutSide ? onRowClickOutSide(e) : navigate(`${e.original[rowId]}`);
  };

  const ACTION_CELL: ColumnInterface = {
    Header: "",
    accessor: "actions",
    isCropped: true,
    disableSortBy: true,
    minWidth: 50,
    width: "3%",
    Cell: (props: any): any => {
      return (
            <ActionCell
              onRemove={allowDelete ? () => !isCancel ? removeEntity(props.row.original?.[removeId || "id"]) : onRemove(props.row.original?.[removeId || "id"]) : null}
              onReload={allowRerun ? () => onReload(props.row.original?.[removeId || "id"]) : null}
              withConfirmation
              isCancel={isCancel}
              showCancel={(!isCancel || (isCancel && (props.row.original.status === 'CREATED' || props.row.original.status === 'EXECUTING'))) }
              entityName={props.row.original.title || props.row.original.name}
          />
      );
    },
  };

  const columns = React.useMemo(
    () => [
      ...cols,
      ...((allowDelete || allowRerun) ? [ACTION_CELL] : []),
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
      px={dense ? 0 : 3}
      flexDirection="column"
      sx={{ backgroundColor: "common.white", flexGrow: 1 }}
      minHeight="100%"
    >
      {variant !== "no-header" && (
        <>
          {variant === "primary" && (
            <ListHeaderPrimary
              iconName={iconName}
              title={tableTitle}
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

      <Grid container className={"table-" + className} mt={2}>
        <Grid item xs={12}>
          <Grid container spacing={4} flexWrap="nowrap">
            <Grid
              item
              xs={12}
              className={"table-data-" + className}
            >
              <Table
                enableSorting={!disableSort}
                manualSortBy
                enablePagination
                manualPagination
                noDataText={"No data currently available"}
                data={tableData}
                columns={columns}
                pageCount={pageCount}
                pageSize={pageSize}
                setPageSize={size => {
                  useStorage?.setStorage("pageSize", size);
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
                    "columns",
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
