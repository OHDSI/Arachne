
import React, { useContext } from 'react';
import { ModalContext, UseModalContext } from '../../../libs/hooks';
import { PageList, CodeEditor } from '../../../libs/components';
import { colsTableEnviroments } from '../../../config';
import { getDescriptors } from '../../../api/submissions';

export const EnviromentsList: React.FC = () => {
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);

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
      'Show descriptor',
      {
        closeOnClickOutside: true,
        onClose: closeModal,
      }
    );
  };

  const cols = React.useMemo(() => colsTableEnviroments(onOpen), []);


  return (
    <PageList
      removeId='username'
      listConfig={{
        rowId: 'id',
        loadingMessage: 'Loading environments...',
        addButtonTitle: '',
        tableTitle: 'Environments',
        importButtonTitle: 'Import',
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