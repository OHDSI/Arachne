import React from 'react';

import { NameCell } from '../../../../libs/components/cells';
import { DBMSType } from '../../../../libs/enums';
import { Button, Icon } from '../../../../libs/components';
import { StatusTag } from '../../../../libs/components/Table';
import { getUsers, removeUser } from '../../../../api/admin';

export const usersListConfig: any = {
  rowId: 'id',
  loadingMessage: 'Loading users...',
  addButtonTitle: 'Add user',
  tableTitle: 'Users',
  importButtonTitle: 'Import',
  listInitialSort: null,
  iconName: 'users',
  fetch: getUsers,
  remove: removeUser,
  getCols: (settings: any) => {
    return [
      {
        Header: 'Name',
        accessor: (props) => {
          return `${props.firstname} ${props.lastname}`
        },
        id: 'name',
        minWidth: 200,
        width: '30%',
        isCropped: true,
        Cell: NameCell,
      },
      {
        Header: 'Email',
        accessor: 'email',
        id: 'email',
        width: '10%',
        minWidth: 200,
        isCropped: true,
        Cell: NameCell,
      },
      {
        Header: 'Roles',
        accessor: 'roles',
        id: 'roles',
        width: '10%',
        minWidth: 200,
        isCropped: true,
        Cell: (props) => props.value.join(','),
      },
    ];
  }
};