import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { listConfig } from './List.config';

import { createDataSource, updateDataSource } from '../../../api/data-sources';
import { ModalContext, UseModalContext } from '../../../libs/hooks/useModal';
import { getUUID } from '../../../libs/utils/getUUID';
import { PageList } from '../../../libs/components/PageList';
import { SecondaryContentWrapper } from '@/libs/components/wrappers';

export const List: FC = () => {
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState();

  const { createEntityModal, getCols } = listConfig;


  const onCreateSubmission = () => {
    openModal(
      () => (
        <>create</>
        // <CreateSubmissionForm
        //   parentId={config?.parentId}
        //   createMethod={createApi?.create}
        //   subModules={moduleConfig.subModules}
        //   onCancel={closeModal}
        //   afterCreate={values => {
        //     setIdReload(getUUID());
        //     closeModal();
        //   }}
        // />
      ),
      'Create submission',
      {
        closeOnClickOutside: true,
        width: '700px',
        onClose: closeModal,
      }
    );
  };

  // const onOpenResultSubmission = useCallback(item => {
  //   openModal(
  //     () => (
  //       <SecondaryContentWrapper>
  //         <FileExplorer submissionId={item.id} url={'datanode/submissions'} />
  //       </SecondaryContentWrapper>
  //     ),
  //     <SubmissionHeader key="modal-header">
  //       <SubmissionHeaderItem>{'Result submission'}</SubmissionHeaderItem>
  //       <SubmissionHeaderItem smallFont>
  //         {getFormatDateAndTime(item.createdDate)}
  //       </SubmissionHeaderItem>
  //     </SubmissionHeader>,
  //     {
  //       closeOnClickOutside: true,
  //       onClose: closeModal,
  //     }
  //   );
  // }, []);

  // useInterval(() => {
  //   setIdReload(getUUID());
  // }, 10000);

  return (
    <PageList
      reloadId={idReload}
      isImport={false}
      onCreate={onCreateSubmission}
      onRowClick={row => {
        // onOpenResultSubmission(row.original);
      }}
      listConfig={listConfig}
      isSilentReload={true}
      allowDelete={false}
      variant="primary"
    />
  );
};
