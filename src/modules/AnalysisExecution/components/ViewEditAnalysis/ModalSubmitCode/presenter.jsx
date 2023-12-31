/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: December 27, 2016
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, Fieldset, Checkbox, ListItem, Button } from 'arachne-ui-components';
import { Field } from 'redux-form';
import DataSources from 'modules/AnalysisExecution/components/ViewEditAnalysis/DataSources';
import GuardedComponent from 'components/Guarded/container';
import { Guard } from 'services/Guard';
import { studyPermissions } from 'modules/StudyManager/const';
import EmptyState from 'components/EmptyState';

require('./style.scss');

function ToggleAll(props) {
  return (
    <ListItem>
      <FormCheckbox {...props} />
    </ListItem>
  );
}

function ModalSubmitCode(props) {
  const classes = new BEMHelper('analysis-form-submit-code');
  const {
    handleSubmit,
    doSubmit,
    submitting,
    dataSourceOptions,
    modal,
    isAllSelected,
    toggleAll,
    closeModal,
    inviteDatasource,
    error,
    grantedPermissions,
  } = props;

  const fields = [
    {
      name: 'dataSources',
      InputComponent: {
        component: DataSources,
        props: {
          dataSources: props.dataSourceOptions,
        },
      }
    }
  ];
  
  const submitBtn = {
    label: 'Submit',
    loadingLabel: 'Submitting...',
    mods: ['success', 'rounded'],
  };

  const cancelBtn = {
    label: 'Cancel',
  };

  return (
    <Modal modal={modal} title="Submit code to data nodes" mods={['no-padding']}>
      <div {...classes()}>
        <ListItem>
          <Checkbox
            {...classes('toggle-btn')}
            label='Select all'
            isChecked={isAllSelected}
            onChange={toggleAll}
          />
        </ListItem>
        <form {...props} onSubmit={handleSubmit(doSubmit)}>
          {props.dataSourceOptions.length === 0
            ? <div {...classes('empty-state')}>
              <EmptyState message={'No data sources were attached to the study. You need at least one approved data source to create a submission'} />
            </div>
            : fields.map(field => <Field {...field} component={Fieldset} />)
          }
          {error && <div {...classes('error')}>{error}</div>}
          <div {...classes('actions')}>
            <GuardedComponent
              rules={new Guard({
                rules: [studyPermissions.inviteDatanode],
                grantedPermissions,
                tooltip: {
                  [studyPermissions.inviteDatanode]: 'you should be lead investigator or datasource owner',
                },
              })}
            >
              <Button {...classes('invite-button')} onClick={inviteDatasource}>
                <span {...classes('invite-button-icon')}>add_circle_outline</span>
                Invite Data Sources
              </Button>
            </GuardedComponent>
            <Button {...classes('submit')} type={'submit'} mods={['success', 'rounded']} disabled={submitting || props.dataSourceOptions.length === 0}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
            <Button {...classes('cancel')} mods={['cancel', 'rounded']} onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ModalSubmitCode;
