
import { FC, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { databasesConfig } from '../Databases.config';
import { CreateDatabaseForm } from '../../CreateDatabaseForm';
import { ModalContext, UseModalContext } from '../../../../libs/hooks/useModal';
import { getUUID } from '../../../../libs/utils/getUUID';
import { setBreadcrumbs } from '../../../../store/modules';
import { PageList } from '../../../../libs/components/PageList';
import { createDataSource } from '../../../../api/data-sources';

export const DatabasesList: FC<{
  onPublish: (id: string) => void;
}> = ({ onPublish }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState(getUUID());
  const onCreateCdmDataSource = () => {
    openModal(
      () => (
        <CreateDatabaseForm
          createMethod={createDataSource}
          onCancel={closeModal}
          afterCreate={() => {
            closeModal();
            setIdReload(getUUID());
          }}
        />
      ),
      'Create new database',
      {
        closeOnClickOutside: true,
        onClose: closeModal,
      }
    );
  };

  const onUpdateCdmDataSource = row => {
    navigate(`${row.original.id}`)
  };

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: 'Admin',
          path: `/administration`,
        },
        {
          name: 'Databases',
          path: `/administration/databases`,
        },
      ])
    );
  }, []);

  return (
    <PageList
      reloadId={idReload}
      isImport={false}
      isCreate={true}
      onCreate={onCreateCdmDataSource}
      listConfig={{
        ...databasesConfig,
        cols: databasesConfig.getCols({
          onPublish: onPublish,
        }),
      }}
      onRowClick={onUpdateCdmDataSource}
      variant="primary"
      allowDelete={true}
    />
  );
};
