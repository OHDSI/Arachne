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
 * Created: January 31, 2018
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import EmptyState from 'components/EmptyState';

import {
  PageContent,
  LoadingPanel,
  Panel,
  Button,
} from 'arachne-ui-components';

import Toolbar from 'modules/DataCatalog/components/DataSource/ViewEdit/Toolbar';
import ModalStatsUpload from 'modules/DataCatalog/components/DataSource/ViewEdit/Edit/ModalStatsUpload';
import FormCreateDataNode from './FormCreateDataNode';
import AttributeList from './AttributesList';
import OwnerList from './OwnerList';
import ModalAddOwner from './ModalAddOwner';

import './style.scss';

class Edit {
  getAchillesSettings() {
    return [];
  }

  render(props) {
    const classes = new BEMHelper('data-source-entry-editor');
    const {
      permissions,
      isDatanodeRegistered,
      dataSourceId,
      isDenied,
      isVirtual,
      isCDM,
      isManual,
      showUploadForm,
      canUploadAchillesResults,
    } = props;

    return (
      <PageContent title={`${props.name} | Arachne`}>
        <div {...classes()}>
          {!isDenied && permissions.EDIT_DATASOURCE
            ? [
              <Toolbar mode={'edit'}>
                <Button
                  {...classes('achilles-btn', canUploadAchillesResults ? '': 'dimmed')}
                  label={'Upload Achilles results'}
                  mods={['rounded', 'submit']}
                  onClick={showUploadForm}
                />
              </Toolbar>,
              <div {...classes('content')}>
                <div className="row">
                  {isDatanodeRegistered
                  ? [
                    <div className='col-xs-6 col-md-6'>
                      <AttributeList />
                      <OwnerList/>
                    </div>,
                    permissions.EDIT_ACHILLES_REPORT_PERMISSION ? <div className='col-xs-6 col-md-6'>
                      {this.getAchillesSettings()}
                    </div> : [] ]
                  : <Panel title='Create data node' {...classes('create-form')}>
                      <FormCreateDataNode dataSourceId={dataSourceId} />
                    </Panel>
                  }
                </div>
              </div>,
              ]
            : <div {...classes('content', 'centered')}>
                <EmptyState message={'You do not have rights to edit this Data Source'} />
              </div>
            }
        </div>
        <ModalStatsUpload />
        <ModalAddOwner />
        <LoadingPanel active={props.isLoading} />
      </PageContent>
    );
  }
}

Edit.propTypes = {
  isLoading: PropTypes.bool,
};

export default Edit;
