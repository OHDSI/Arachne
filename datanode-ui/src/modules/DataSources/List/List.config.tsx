import { getDataSources, removeDataSource } from '../../../api/data-sources';
import { Button, Icon } from '../../../libs/components';
import { StatusTag } from '../../../libs/components/Table';
import { NameCell } from '../../../libs/components/cells';
import React from 'react';




export const listConfig: any = {
  rowId: 'id',
  loadingMessage: 'Loading data cources...',
  addButtonTitle: 'Add Data Source',
  tableTitle: 'Data sources',
  importButtonTitle: 'Import',
  listInitialSort: null,
  iconName: 'dataCatalog',
  fewtch: getDataSources,
  remove: removeDataSource,
  getCols: (settings: any) => {
    return [
      {
        Header: 'Name',
        accessor: 'name',
        id: 'name',
        minWidth: 200,
        width: '30%',
        isCropped: true,
        Cell: NameCell,
      },
      {
        Header: 'DBMS type',
        accessor: 'type',
        id: 'type',
        width: '10%',
        minWidth: 110,
        isCropped: true,
      },
      {
        Header: 'Database',
        accessor: 'connectionString',
        id: 'connectionString',
        minWidth: 120,
        maxWidth: 240,
        isCropped: true,
      },
      {
        Header: 'CDM schema',
        accessor: 'cdmSchema',
        id: 'cdmSchema',
        width: '5%',
        minWidth: 80,
      },
      {
        Header: 'Model',
        accessor: 'modelType',
        id: 'modelType',
        width: '5%',
        minWidth: 80,
      },
      {
        Header: '',
        accessor: 'published',
        id: 'published',
        width: '7%',
        minWidth: 110,
        isCropped: true,
        Cell: (props: any) => {
          return !props.value || props.value.length === 0 ? (
            <Button
              size="xsmall"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                settings?.onPublish(props.row.original.id);
              }}
              color="info"
              variant="outlined"
              startIcon={<Icon iconName="publish" />}
              sx={{
                px: 2,
                py: 0.25,
                borderRadius: 0.5,
                fontSize: 12,
                minWidth: 98,
              }}
            >
              Publish
            </Button>
          ) : (
            <StatusTag text="Published" color="success" />
          );
        },
      },
    ];
  },
  // cols: [
  //   // {
  //   //   Header: 'Id',
  //   //   accessor: 'shortcut',
  //   //   id: 'id',
  //   // },
  //   {
  //     Header: 'Name',
  //     accessor: 'name',
  //     maxWidth: 400,
  //     isCropped: true,
  //   },
  //   {
  //     Header: 'DBMS type',
  //     accessor: 'type',
  //   },
  //   {
  //     Header: 'Database',
  //     accessor: 'connectionString',
  //     isCropped: true,
  //   },
  //   {
  //     Header: 'CDM schema',
  //     accessor: 'cdmSchema',
  //     id: 'schema',
  //   },
  //   {
  //     Header: 'Model',
  //     accessor: 'modelType',
  //     id: 'modelType',
  //   },
  //   {
  //     Header: '',
  //     accessor: 'published',
  //     id: 'published',
  //     Cell: (props: any) => {
  //       return (
  //         <ActionCell>
  // <Tooltip text="Publish" color="primary" width="auto">
  //   <div>
  //     <Button
  //       size="xsmall"
  //       sx={{ width: 26, height: 26, minWidth: 0 }}
  //       onClick={(e: React.MouseEvent) => {
  //         e.stopPropagation();
  //       }}
  //     >
  //       <Icon
  //         iconName="import"
  //         sx={{ fontSize: 18, opacity: 0.6 }}
  //       />
  //     </Button>
  //   </div>
  // </Tooltip>
  //         </ActionCell>
  //       )
  //     },
  //   },
  // ],
};
