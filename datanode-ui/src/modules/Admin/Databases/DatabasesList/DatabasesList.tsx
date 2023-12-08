
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { CreateDatabaseForm } from '../../CreateDatabaseForm';
import { ModalContext, UseModalContext } from '../../../../libs/hooks';
import { getUUID } from '../../../../libs/utils';
import { setBreadcrumbs } from '../../../../store/modules';
import { PageList } from '../../../../libs/components';
import { createDataSource, getDataSources, getDbmsTypes, removeDataSource } from '../../../../api/data-sources';
import { colsTableDatabase } from '../../../../config';
import { DBMSTypesInterface } from '@/libs/types';

export const DatabasesList: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState<string>(getUUID());
  const [dbsmTypes, setDbsmTypes] = useState<DBMSTypesInterface[]>([]);

  const cols = React.useMemo(() => colsTableDatabase(t, dbsmTypes), [t, dbsmTypes]);

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
      t('modals.create_database.header'),
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
          name: t('breadcrumbs.admin'),
          path: `/administration`,
        },
        {
          name: t('breadcrumbs.databases'),
          path: `/administration/databases`,
        },
      ])
    );
  }, [dispatch]);

  useEffect(() => {
    getDbmsTypes().then((res: DBMSTypesInterface[]) => {
      setDbsmTypes(res);
    });
  }, []);

  return (
    <PageList
      reloadId={idReload}
      onCreate={onCreate}
      listConfig={{
        rowId: 'id',
        loadingMessage: t('pages.administration.databases.loading_message'),
        addButtonTitle: t('pages.administration.databases.add_button'),
        tableTitle: t('pages.administration.databases.header'),
        importButtonTitle: t('common.buttons.import'),
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
