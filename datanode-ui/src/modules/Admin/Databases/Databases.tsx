import { FC, useContext, useState } from 'react';

import { Route, Routes } from 'react-router';
import { DatabaseEntity } from '../DatabaseEntity';

import { DatabasesList } from './DatabasesList';
import { PublishDataSourceForm } from '../PublishDataSourceForm';
import { getUUID } from '../../../libs/utils/getUUID';
import { ModalContext, UseModalContext } from '../../../libs/hooks/useModal';
import { publishDataSource } from '../../../api/data-sources';

export const Databases: FC<any> = ({ root }) => {
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [isReload, setIdReload] = useState(getUUID());

  

  const onPublish = (id: any) => {
    openModal(
      () => (
        <PublishDataSourceForm
          dataSourceId={id}
          onCancel={closeModal}
          createMethod={publishDataSource}
          onPublish={values => {
            setIdReload(getUUID());
            closeModal();
          }}
        />
      ),
      'Publish data source',
      {
        closeOnClickOutside: true,
        onClose: closeModal,
      }
    );
  };

  return (
    <>
      <Routes>
        <Route
          path="*"
          element={<DatabasesList onPublish={onPublish} />}
        />
        <Route
          path=":id/*"
          element={<DatabaseEntity onPublish={onPublish} />}
        />
      </Routes>
    </>
  );
};
