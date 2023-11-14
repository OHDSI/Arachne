import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { listConfig } from './List.config';

import CreateCdmDataSourceForm from '../CreateCdmDataSourceForm';
import { createDataSource, updateDataSource } from '../../../api/data-sources';
import { ModalContext, UseModalContext } from '../../../libs/hooks/useModal';
import { getUUID } from '../../../libs/utils/getUUID';
import { PageList } from '../../../libs/components/PageList';

export const List: FC = () => {
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState();

  const { createEntityModal, getCols } = listConfig;

  const onPublish = (id: any) => {
    openModal(
      () => (
        <></>
        // <PublishDataSourceForm
        //   dataSourceId={id}
        //   onCancel={closeModal}
        //   createMethod={publishDataSource}
        //   onPublish={values => {
        //     setIdReload(getUUID());
        //     closeModal();
        //   }}
        // />
      ),
      'Publish data source',
      {
        closeOnClickOutside: true,
        onClose: closeModal,
      }
    );
  };

  const onCreateCdmDataSource = () => {
    openModal(
      () => (
        <CreateCdmDataSourceForm
          // parentId={config?.parentId}
          createMethod={createDataSource}
          onCancel={closeModal}
          afterCreate={values => {
            closeModal();
            setIdReload(getUUID());
          }}
        />
      ),
      'Create data source',
      {
        closeOnClickOutside: true,
        onClose: closeModal,
      }
    );
  };

  const onUpdateCdmDataSource = (val: any) => {
    openModal(
      () => (
        <CreateCdmDataSourceForm
          // parentId={config?.parentId}
          createMethod={createDataSource}
          onCancel={closeModal}
          values={val.original}
          isUpdate={true}
          afterCreate={values => {
            setIdReload(getUUID());
            closeModal();
          }}
        />
      ),
      'Update data source',
      {
        closeOnClickOutside: true,
        onClose: closeModal,
      }
    );
  };

  return (
    <PageList
      reloadId={idReload}
      isImport={false}
      isCreate={true}
      onCreate={onCreateCdmDataSource}
      listConfig={{
        ...listConfig,
        cols: getCols({
          onPublish: onPublish,
        }),
      }}
      onRowClick={onUpdateCdmDataSource}
      variant="primary"
      allowDelete={true}
    />
  );
};
