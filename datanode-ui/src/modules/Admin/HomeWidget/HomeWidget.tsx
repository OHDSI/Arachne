import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { CreateDatabaseForm } from '../CreateDatabaseForm';
import { ModalContext, UseModalContext } from '../../../libs/hooks';
import { createDataSource } from '../../../api/data-sources';
import { ModuleDescriptionCard } from '../../Submissions/ModuleDescriptionCard';
import { Button, Grid, Icon } from '../../../libs/components';
import { HomeInfo } from '../HomeInfo';

export const HomeWidget: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);


  const onCreateCdmDataSource = () => {
    openModal(
      () => (
        <CreateDatabaseForm
          createMethod={createDataSource}
          onCancel={closeModal}
          afterCreate={() => {
            closeModal();
            navigate('/administration/databases');
          }}
        />
      ),
      t('modals.create_database.header'),
      {
        closeOnClickOutside: true,
        onClose: closeModal,
        width: 700,
      }
    );
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ModuleDescriptionCard
          title={t('pages.administration.databases.header')}
          onClick={() => navigate('/administration/databases')}
          description={t('pages.administration.databases.description')}
          iconName="dataCatalog"
          actions={
            <>
              <Button
                onClick={() => onCreateCdmDataSource()}
                variant="contained"
                color="success"
                size="small"
                name="save"
                startIcon={<Icon iconName="add" />}
              >
                {t('pages.administration.databases.add_button')}
              </Button>
              <Button
                onClick={() => navigate('/administration/databases')}
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
        </ModuleDescriptionCard>
      </Grid>
      <Grid item xs={12}>
        <ModuleDescriptionCard
          title={t('pages.administration.databases.header_links')}
          onClick={() => navigate('/administration/databases')}
          description={t('pages.administration.databases.description_links')}
          iconName="study"
          actions={
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => { }}
                size="small"
                name="save"
                startIcon={<Icon iconName="github" />}
              >
                <a href="https://github.com/OHDSI/Arachne" className="link-primary" target="_blank" >
                  {t('pages.administration.databases.github_repo')}
                </a>
              </Button>
              <Button
                onClick={() => { }}
                variant="outlined"
                color="primary"
                size="small"
                name="save"
                sx={{ ml: 1 }}
                startIcon={<Icon iconName="wiki" />}
              >
                <a href="https://github.com/OHDSI/Arachne/wiki" className="link-primary" target="_blank" >
                  {t('pages.administration.databases.github_wiki')}
                </a>
              </Button>
            </>
          }
        >
          <Grid item xs={12} pt={2}>
            <HomeInfo />
          </Grid>
        </ModuleDescriptionCard>
      </Grid>
    </Grid>
  );
};
