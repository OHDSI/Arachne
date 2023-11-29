import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';


import { CreateDatabaseForm } from '../CreateDatabaseForm';
import { ModalContext, UseModalContext } from '../../../libs/hooks';
import { createDataSource } from '../../../api/data-sources';
import { ModuleDescriptionCard } from '../../Submissions/ModuleDescriptionCard';
import { Button, Icon } from '../../../libs/components';

export const HomeWidget: React.FC = () => {
  const navigate = useNavigate();
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
      'Create database',
      {
        closeOnClickOutside: true,
        onClose: closeModal,
        width: 700,
      }
    );
  };
  return (
    <ModuleDescriptionCard
      title="Databases"
      onClick={() => navigate('/administration/databases')}
      description="List of databases."
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
            Add database
          </Button>
          <Button
            onClick={() => navigate('/administration/databases')}
            variant="outlined"
            size="small"
            name="save"
            sx={{ ml: 1 }}
          >
            View all
          </Button>
        </>
      }
    ></ModuleDescriptionCard>
  );
};
