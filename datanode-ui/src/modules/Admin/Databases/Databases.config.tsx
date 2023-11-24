import React from 'react';
import { getDataSources, removeDataSource } from '../../../api/data-sources';
import { NameCell } from '../../../libs/components/cells';
import { DBMSType } from '../../../libs/enums';

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
  getCols: () => {
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
      }
    ];
  },
};
