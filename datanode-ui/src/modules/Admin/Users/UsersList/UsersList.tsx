
import React from 'react';
import { PageList } from '../../../../libs/components';
import { getUsers, removeUser } from '../../../../api/admin';
import { colsTableUsers } from '../../../../config';

export const UsersList: React.FC = () => {

  const cols = React.useMemo(() => colsTableUsers, []);

  return (
    <PageList
      removeId='username'
      listConfig={{
        rowId: 'id',
        loadingMessage: 'Loading users...',
        addButtonTitle: '',
        tableTitle: 'Users',
        importButtonTitle: 'Import',
        listInitialSort: null,
        iconName: 'users',
        fetch: getUsers,
        remove: removeUser,
        cols: cols
      }}
      onRowClick={() => { }}
      variant="primary"
    />
  );
};