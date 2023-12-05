import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { createSubmission as createSubmissionApi } from '../../../api/submissions';

import { getFormatDateAndTime } from '../../../libs/utils';
import { ModalContext, UseModalContext } from '../../../libs/hooks';
import { SubmissionDTOInterface } from '../../../libs/types';
import { Button, Grid, Icon } from '../../../libs/components';

import { CreateSubmissionForm } from '../CreateSubmissionForm';
import LatestSubmissions from '../LatestSubmissions';
import { ModuleDescriptionCard } from '../ModuleDescriptionCard';
import { SubmissionResult } from '../SubmissionResult';

import {
  SubmissionHeader,
  SubmissionHeaderItem,
} from '../LatestSubmissions/LatestSubmissions.styles';




export const HomeWidget: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);


  const createSubmission = () => {
    openModal(
      () => (
        <CreateSubmissionForm
          createMethod={createSubmissionApi}
          onCancel={closeModal}
          afterCreate={() => {
            closeModal();
            navigate('/submissions');
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
  const onOpenResultSubmission = (item: SubmissionDTOInterface) => {
    openModal(
      () => (
        <SubmissionResult item={item} />
      ),
      <SubmissionHeader>
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

  return (
    <ModuleDescriptionCard
      title="Submissions"
      onClick={() => navigate('/submissions')}
      description="List of submissions."
      iconName="library"
      actions={
        <>
          <Button
            onClick={() => createSubmission()}
            variant="contained"
            color="success"
            size="small"
            name="save"
            startIcon={<Icon iconName="add" />}
          >
            Add submission
          </Button>
          <Button
            onClick={() => navigate('/submissions')}
            variant="outlined"
            size="small"
            name="save"
            sx={{ ml: 1 }}
          >
            View all
          </Button>
        </>
      }
    >
      <Grid item xs={12} pt={2}>
        <LatestSubmissions openSubmission={onOpenResultSubmission} />
      </Grid>
    </ModuleDescriptionCard>
  );
};
