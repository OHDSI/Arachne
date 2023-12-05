
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { CreateDatabaseForm } from '../../CreateDatabaseForm';
import { ModalContext, UseModalContext } from '../../../../libs/hooks';
import { getUUID } from '../../../../libs/utils';
import { setBreadcrumbs } from '../../../../store/modules';
import { PageList } from '../../../../libs/components';
import { createDataSource, getDataSources, removeDataSource } from '../../../../api/data-sources';
import { colsTableDatabase } from '../../../../config';

export const DatabasesList: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState<string>(getUUID());

  const cols = React.useMemo(() => colsTableDatabase, []);

  const onCreate = () => {
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
  }, [dispatch]);

  return (
    <PageList
      reloadId={idReload}
      onCreate={onCreate}
      listConfig={{
        rowId: 'id',
        loadingMessage: 'Loading databases...',
        addButtonTitle: 'Add database',
        tableTitle: 'Databases',
        importButtonTitle: 'Import',
        // listInitialSort: { id: 'id', desc: true },
        iconName: 'dataCatalog',
        fetch: getDataSources,
        remove: removeDataSource,
        cols: cols
      }}
      onRowClick={(row: { original: { id: string } }) => navigate(`${row.original.id}`)}
      variant="primary"
      allowDelete={true}
    />
  );
};
