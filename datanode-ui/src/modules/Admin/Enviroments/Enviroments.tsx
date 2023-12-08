
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalContext, UseModalContext } from '../../../libs/hooks';
import { PageList, CodeEditor } from '../../../libs/components';
import { colsTableEnviroments } from '../../../config';
import { getDescriptors } from '../../../api/submissions';
import { useDispatch } from 'react-redux';
import { setBreadcrumbs } from '../../../store/modules';

export const EnviromentsList: React.FC = () => {
  const dispatch = useDispatch();
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: t('breadcrumbs.admin'),
          path: `/administration`,
        },
        {
          name: t('breadcrumbs.envs'),
          path: `/administration/environments`,
        },
      ])
    );
  }, [dispatch]);

  const onOpen = (data) => {
    openModal(
      () => (
        <CodeEditor
          data={data || ''}
          height={'80vh'}
          containerStyles={{ padding: 0 }}
          enableDownload={true}
          language='json'
          enableCopy
          readOnly
        />
      ),
      t('modals.show_descriptor.header'),
      {
        closeOnClickOutside: true,
        onClose: closeModal,
      }
    );
  };

  const cols = React.useMemo(() => colsTableEnviroments(t, onOpen), [t]);

  return (
    <PageList
      removeId='username'
      listConfig={{
        rowId: 'id',
        loadingMessage: t('pages.administration.envs.loading_message'),
        addButtonTitle: '',
        tableTitle: t('pages.administration.envs.header'),
        importButtonTitle: t('common.buttons.import'),
        listInitialSort: null,
        iconName: '',
        fetch: getDescriptors,
        cols: cols
      }}
      onRowClick={() => { }}
      variant="primary"
    />
  );
};