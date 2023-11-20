import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ModalContext, UseModalContext } from '../../../libs/hooks';
import { getUUID, getFormatDateAndTime } from '../../../libs/utils';
import { PageList, FileExplorer, SecondaryContentWrapper } from '../../../libs/components';
import { createSubmission } from '../../../api/submissions';
import { setBreadcrumbs } from '../../../store/modules';

import { CreateSubmissionForm } from '../CreateSubmissionForm';
import { listConfig } from './List.config';
import { SubmissionHeader, SubmissionHeaderItem } from './List.styles';


export const List: React.FC = () => {
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: 'Submissions',
          path: `/submissions`,
        }
      ])
    );
  }, []);



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
          <FileExplorer submissionId={item.id} url={'analysis'} />
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
