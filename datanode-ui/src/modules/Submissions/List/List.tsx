import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { listConfig } from './List.config';

import { ModalContext, UseModalContext } from '../../../libs/hooks/useModal';
import { getUUID } from '../../../libs/utils/getUUID';
import { PageList } from '../../../libs/components/PageList';
import { SecondaryContentWrapper } from '../../../libs/components/wrappers';
import CreateSubmissionForm from '../CreateSubmissionForm';
import { createSubmission } from '../../../api/submissions';
import { FileExplorer } from '../../../libs/components/FileExplorer';
import { SubmissionHeader, SubmissionHeaderItem } from './List.styles';
import { getFormatDateAndTime } from '../../../libs/utils/getFormatDate';

export const List: FC = () => {
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState();


  const onCreateSubmission = () => {
    openModal(
      () => (
        <CreateSubmissionForm
          createMethod={createSubmission}
          onCancel={closeModal}
          afterCreate={values => {
            setIdReload(getUUID());
            closeModal();
          }}
        />
      ),
      'Create submission',
      {
        closeOnClickOutside: true,
        width: '700px',
        onClose: closeModal,
      }
    );
  };

  const onOpenResultSubmission = useCallback(item => {
    openModal(
      () => (
        <SecondaryContentWrapper>
          <FileExplorer submissionId={item.id} url={'datanode/submissions'} />
        </SecondaryContentWrapper>
      ),
      <SubmissionHeader key="modal-header">
        <SubmissionHeaderItem>{'Result submission'}</SubmissionHeaderItem>
        <SubmissionHeaderItem smallFont>
          {getFormatDateAndTime(item.createdDate)}
        </SubmissionHeaderItem>
      </SubmissionHeader>,
      {
        closeOnClickOutside: true,
        onClose: closeModal,
      }
    );
  }, []);

  // useInterval(() => {
  //   setIdReload(getUUID());
  // }, 10000);

  return (
    <PageList
      reloadId={idReload}
      isImport={false}
      onCreate={onCreateSubmission}
      onRowClick={row => {
        onOpenResultSubmission(row.original);
      }}
      listConfig={{
        ...listConfig,
        cols: listConfig.getCols(),
      }}
      isSilentReload={true}
      allowDelete={false}
      variant="primary"
    />
  );
};
