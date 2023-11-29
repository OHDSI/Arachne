
import React, { useContext, useState } from 'react';
import { ModalContext, UseModalContext } from '../../../../libs/hooks';
import { getUUID } from '../../../../libs/utils';
import { PageList } from '../../../../libs/components';
import { AddUserForm } from '../AddUserForm';
import { getUsers, removeUser } from '../../../../api/admin';
import { colsTableUsers } from '../../../../config';

export const UsersList: React.FC = () => {
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState<string>(getUUID());

  const cols = React.useMemo(() => {
    return colsTableUsers;
  }, []);

  const onAddUser = () => {
    openModal(
      () => (
        <AddUserForm onCancel={closeModal} afterCreate={() => {
          setIdReload(getUUID());
          closeModal();
        }} />
      ),
      'Add user',
      {
        closeOnClickOutside: true,
        width: 700,
        onClose: closeModal,
      }
    );
  };

  return (
    <PageList
      reloadId={idReload}
      removeId='username'
      onCreate={onAddUser}
      listConfig={{
        rowId: 'id',
        loadingMessage: 'Loading users...',
        addButtonTitle: 'Add user',
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
      allowDelete={true}
    />
  );
};