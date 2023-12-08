import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation()
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
      t('modals.create_submission.header'),
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
        <SubmissionHeaderItem>{t('modals.files_results.header')}</SubmissionHeaderItem>
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
      title={t('pages.submissions.header')}
      onClick={() => navigate('/submissions')}
      description={t('pages.submissions.description')}
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
            {t('pages.submissions.add_button')}
          </Button>
          <Button
            onClick={() => navigate('/submissions')}
            variant="outlined"
            size="small"
            name="save"
            sx={{ ml: 1 }}
          >
            {t('common.buttons.view_all')}
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
