
import { FC, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { CreateDatabaseForm } from '../../CreateDatabaseForm';
import { ModalContext, UseModalContext } from '../../../../libs/hooks/useModal';
import { getUUID } from '../../../../libs/utils/getUUID';
import { setBreadcrumbs } from '../../../../store/modules';
import { PageList } from '../../../../libs/components/PageList';
import { createDataSource } from '../../../../api/data-sources';
import { usersListConfig } from './UsersList.config'
import { AddUserForm } from '../AddUserForm';

export const UsersList: FC<any> = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState(getUUID());

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
      isImport={false}
      isCreate={true}
      onCreate={onAddUser}
      listConfig={{
        ...usersListConfig,
        cols: usersListConfig.getCols({
          onPublish: () => { },
        }),
      }}
      onRowClick={() => { }}
      variant="primary"
      allowDelete={true}
    />
  );
};