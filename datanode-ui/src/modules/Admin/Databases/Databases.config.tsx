import React from 'react';

import { getDataSources, removeDataSource } from '../../../api/data-sources';
import { NameCell } from '../../../libs/components/cells';
import { DBMSType } from '../../../libs/enums';
import { Button, Icon } from '../../../libs/components';
import { StatusTag } from '../../../libs/components/Table';

export const databasesConfig: any = {
  rowId: 'id',
  loadingMessage: 'Loading databases...',
  addButtonTitle: 'Add database',
  tableTitle: 'Databases',
  importButtonTitle: 'Import',
  listInitialSort: null,
  iconName: 'dataCatalog',
  fetch: getDataSources,
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
        accessor: 'dbmsType',
        id: 'dbmsType',
        width: '10%',
        minWidth: 110,
        isCropped: true,
        Cell: (props) => {
          return DBMSType[props.value]
        }
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
      // {
      //   Header: 'Model',
      //   accessor: 'modelType',
      //   id: 'modelType',
      //   width: '5%',
      //   minWidth: 80,
      // },
      // {
      //   Header: '',
      //   accessor: 'published',
      //   id: 'published',
      //   width: '7%',
      //   minWidth: 110,
      //   isCropped: true,
      //   Cell: (props: any) => {
      //     return !props.value || props.value.length === 0 ? (
      //       <Button
      //         size="xsmall"
      //         onClick={(e: React.MouseEvent) => {
      //           e.stopPropagation();
      //           settings?.onPublish(props.row.original.id);
      //         }}
      //         color="info"
      //         variant="outlined"
      //         startIcon={<Icon iconName="publish" />}
      //         sx={{
      //           px: 2,
      //           py: 0.25,
      //           borderRadius: 0.5,
      //           fontSize: 12,
      //           minWidth: 98,
      //         }}
      //       >
      //         Publish
      //       </Button>
      //     ) : (
      //       <StatusTag text="Published" color="success" />
      //     );
      //   },
      // },
    ];
  },
};
