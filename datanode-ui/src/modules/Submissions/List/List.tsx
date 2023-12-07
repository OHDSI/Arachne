import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ModalContext, UseModalContext, useInterval } from '../../../libs/hooks';
import { getUUID, getFormatDateAndTime } from '../../../libs/utils';
import { PageList } from '../../../libs/components';
import { createSubmission, getSubmissions } from '../../../api/submissions';
import { setBreadcrumbs } from '../../../store/modules';

import { CreateSubmissionForm } from '../CreateSubmissionForm';
import { SubmissionHeader, SubmissionHeaderItem } from './List.styles';
import { removeDataSource } from '../../../api/data-sources';
import { colsTableSubmissions } from '../../../config';
import { SubmissionResult } from '../SubmissionResult';
import { SubmissionDTOInterface } from '@/libs/types';
import { RerunSubmissionForm } from '../RerunSubmissionForm';


export const List: React.FC = () => {
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState<string>(getUUID());
  const dispatch = useDispatch();

  const cols = React.useMemo(() => colsTableSubmissions, []);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: 'Submissions',
          path: `/submissions`,
        }
      ])
    );
  }, [dispatch]);

  const onCreate = () => {
    openModal(
      () => (
        <CreateSubmissionForm
          createMethod={createSubmission}
          onCancel={closeModal}
          afterCreate={() => {
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

  const onReload = (id: string) => {
    openModal(
      () => (
        <RerunSubmissionForm
          id={id}
          createMethod={createSubmission}
          onCancel={closeModal}
          afterCreate={() => {
            setIdReload(getUUID());
            closeModal();
          }}
        />
      ),
      'Rerun submission',
      {
        closeOnClickOutside: true,
        width: '700px',
        onClose: closeModal,
      }
    );
  };


  const onOpenResult = (item: SubmissionDTOInterface) => {
    openModal(
      () => (
        <SubmissionResult item={item} />
      ),
      <SubmissionHeader key="modal-header">
        <SubmissionHeaderItem>{'Result submission'}</SubmissionHeaderItem>
        {item.finished && (
          <SubmissionHeaderItem smallFont>
            {getFormatDateAndTime(item.finished)}
          </SubmissionHeaderItem>
        )}
      </SubmissionHeader>,
      {
        closeOnClickOutside: true,
        onClose: closeModal,
      }
    );
  };

  useInterval(() => {
    setIdReload(getUUID());
  }, 10000);

  return (
    <PageList
      reloadId={idReload}
      onCreate={onCreate}
      onReload={onReload}
      onRowClick={row => onOpenResult(row.original)}
      listConfig={{
        rowId: 'id',
        loadingMessage: 'Loading submission...',
        addButtonTitle: 'Add submission',
        tableTitle: 'Submissions',
        importButtonTitle: 'Import',
        iconName: 'library',
        fetch: getSubmissions,
        remove: removeDataSource,
        listInitialSort: { id: 'id', desc: true },
        cols: cols
      }}
      isSilentReload={true}
      allowDelete={false}
      allowRerun={true}
      variant="primary"
    />
  );
};
