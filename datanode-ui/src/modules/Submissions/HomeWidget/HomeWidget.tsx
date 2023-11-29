import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import LatestSubmissions from '../LatestSubmissions';

import {
  SubmissionHeader,
  SubmissionHeaderItem,
} from '../LatestSubmissions/LatestSubmissions.styles';
import { ModalContext, UseModalContext } from '../../../libs/hooks';
import { CreateSubmissionForm } from '../CreateSubmissionForm';

import { getFormatDateAndTime } from '../../../libs/utils';
import { ModuleDescriptionCard } from '../ModuleDescriptionCard';
import { Button, Grid, Icon, SecondaryContentWrapper, FileExplorer } from '../../../libs/components';
import { createSubmission as createSubmissionApi } from '../../../api/submissions';

export const HomeWidget: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);


  const createSubmission = () => {
    openModal(
      () => (
        <CreateSubmissionForm
          createMethod={createSubmissionApi}
          onCancel={closeModal}
          afterCreate={values => {
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
  const onOpenResultSubmission = item => {
    openModal(
      () => (
        <SecondaryContentWrapper>
          <FileExplorer submissionId={item.id} url={'analysis'} />
        </SecondaryContentWrapper>
      ),
      <SubmissionHeader>
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
