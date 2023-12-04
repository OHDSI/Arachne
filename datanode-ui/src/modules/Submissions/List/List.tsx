import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ModalContext, UseModalContext, useInterval } from '../../../libs/hooks';
import { getUUID, getFormatDateAndTime } from '../../../libs/utils';
import { PageList, FileExplorer, SecondaryContentWrapper, Grid, TabsNavigationNew, Block } from '../../../libs/components';
import { createSubmission, getSubmissions } from '../../../api/submissions';
import { setBreadcrumbs } from '../../../store/modules';

import { CreateSubmissionForm } from '../CreateSubmissionForm';
import { SubmissionHeader, SubmissionHeaderItem } from './List.styles';
import { removeDataSource } from '../../../api/data-sources';
import { colsTableSubmissions, tabsSubmissionResult } from '../../../config';
import { Paper } from '@mui/material';
import { SubmissionResult } from '../SubmissionResult';


export const List: React.FC = () => {
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState<string>(getUUID());
  const dispatch = useDispatch();

  const cols = React.useMemo(() => {
    return colsTableSubmissions;
  }, []);

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


  const onOpenResult = useCallback(item => {
    openModal(
      () => (
        <SubmissionResult item={item} />
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

  useInterval(() => {
    setIdReload(getUUID());
  }, 10000);

  return (
    <PageList
      reloadId={idReload}
      onCreate={onCreate}
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
      variant="primary"
    />
  );
};
