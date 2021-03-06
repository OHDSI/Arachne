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

// @ts-check
import { Component } from 'react';
import actions from 'actions/index';
import { get } from 'services/Utils';
import Utils, { ContainerBuilder } from 'services/Utils';
import isEmpty from 'lodash/isEmpty';
import { ModalUtils } from 'arachne-ui-components';
import { forms, dataSourcePermissions, paths } from 'modules/DataCatalog/const';
import { push as goToPage } from 'react-router-redux';
import Presenter from './presenter';
import { modelTypesValues, executionPolicy } from 'const/dataSource';

const presenterComponent = new Presenter();

/** @augments { Component<any, any> } */
class StatefulEdit extends Component {
  static propTypes() {
    return {
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSourceId !== nextProps.dataSourceId) {
    }
  }

  render() {
    return presenterComponent.render(this.props);
  }
}

class DataCatalogEditBuilder extends ContainerBuilder {

  getComponent() {
    return StatefulEdit;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = get(state, 'dataCatalog');
    const permissions = get(state, 'dataCatalog.dataSource.data.result.permissions', {}, 'Object');
    const isDatanodeRegistered = get(state, 'dataCatalog.dataSource.data.result.dataNode.published');
    const isDenied = isEmpty(get(state, 'dataCatalog.dataSource.data.result', {}, 'Object'));
    const isVirtual = get(state, 'dataCatalog.dataSource.data.result.dataNode.virtual', false);
    const isCDM = get(state, 'dataCatalog.dataSource.data.result.modelType', '') === modelTypesValues.CDM;
    const isManual = get(state, 'dataCatalog.dataSource.data.result.executionPolicy', '') === executionPolicy.MANUAL;
  
    return {
      name: `${get(moduleState, 'dataSource.data.result.dataNode.name', '')}: ${get(moduleState, 'dataSource.data.result.name', '')}`,
      isLoading: moduleState.dataSource.isLoading || false,
      permissions,
      isDatanodeRegistered,
      dataSourceId: ownProps.params.dataSourceId,
      isDenied,
      isVirtual,
      isCDM,
      canUploadAchillesResults: isDatanodeRegistered && !isVirtual && isCDM && permissions.UPLOAD_ACHILLES_REPORTS,
    };
  }

  getMapDispatchToProps() {
    return {
      loadDataSource: actions.dataCatalog.dataSource.find,
      showUploadForm: () => ModalUtils.actions.toggle(forms.modalStatsUpload, true),
      remove: actions.dataCatalog.dataSource.delete,
      goToPage,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      showUploadForm: () => {
        if (stateProps.canUploadAchillesResults) {
          dispatchProps.showUploadForm();
        } else {
          if (confirm('This data source was not detected to be CDM compliant. Are you sure that you still want upload Achilles stats?')) {
            dispatchProps.showUploadForm();
          }
        }
      },
    };
  }

  getFetchers({ params, state, dispatch }) {
    const id = params.dataSourceId;
    return {
      loadDataSource: actions.dataCatalog.dataSource.find.bind(null, { id }),
    };
  }

}

export default DataCatalogEditBuilder;
export {
  StatefulEdit,
};
