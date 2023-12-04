
import React, { useContext, useState } from 'react';
import { ModalContext, UseModalContext } from '../../../libs/hooks';
import { PageList } from '../../../libs/components';
import { colsTableEnviroments } from '../../../config';
import { getDescriptors } from '../../../api/submissions';
import { CodeEditor } from '../../../libs/components/CodeEditor';

export const EnviromentsList: React.FC = () => {
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const onOpen = (data) => {
    console.log(data)
    openModal(
      () => (
        <CodeEditor
          data={data || ''}
          height={'80vh'}
          containerStyles={{ padding: 0 }}
          enableDownload={false}
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

  const cols = React.useMemo(() => {
    return colsTableEnviroments(onOpen);
  }, []);


  return (
    <PageList
      removeId='username'
      // onCreate={onAddUser}
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