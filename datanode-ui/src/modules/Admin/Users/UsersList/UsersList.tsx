
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageList } from '../../../../libs/components';
import { getUsers, removeUser } from '../../../../api/admin';
import { colsTableUsers } from '../../../../config';

export const UsersList: React.FC = () => {
  const { t } = useTranslation()
  const cols = React.useMemo(() => colsTableUsers(t), [t]);

  return (
    <PageList
      removeId='username'
      listConfig={{
        rowId: 'id',
        loadingMessage: t('pages.administration.users.loading_message'),
        addButtonTitle: '',
        tableTitle: t('pages.administration.users.header'),
        importButtonTitle: t('common.buttons.import'),
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