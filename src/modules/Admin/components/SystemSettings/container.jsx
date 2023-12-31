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
 * Created: April 14, 2017
 *
 */

import actions from 'actions/index';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get } from 'services/Utils';
import { asyncConnect } from 'redux-async-connect';
import { apply as applySettings } from 'modules/Admin/ducks/systemSettings';
import { ContainerBuilder } from 'services/Utils';
import { solrDomains } from 'modules/Admin/const';
import presenter from './presenter';
import selectors from './selectors';

class SystemSettings extends Component {

  static propTypes = {
    loadSystemSettings: PropTypes.func,
  };

  render() {
    return presenter(this.props);
  }
}

class SystemSettingsBuilder extends ContainerBuilder {

  getComponent() {
    return SystemSettings;
  }

  mapStateToProps(state) {
    return {
      isApplied: get(state, 'adminSettings.systemSettings.queryResult.result.applied', true),
      isLoading: state.adminSettings.systemSettings.isLoading,
      settingGroupList: selectors.getSystemSettings(state),
      reindexProcess: selectors.getReindexProcess(state),
    };
  }

  getMapDispatchToProps() {
    return {
      loadSystemSettings: actions.adminSettings.systemSettings.query,
      saveData: actions.adminSettings.systemSettings.create,
      applySettings: applySettings,
      solrReindex: actions.adminSettings.solrIndex.create,
      closeLoader: () => actions.adminSettings.atlasConnection.reset,
      toggleIsReindexing: actions.adminSettings.reindexProcess.toggle,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit: (formName, data) => {
        const settingGroup = stateProps.settingGroupList.find(sg => sg.name === formName);

        const newVals = settingGroup.fieldList.reduce(
          (obj, field) => {
            let newVals = obj;
            const initialFieldVal = selectors.parseValue(field);
            const newFieldVal = data[field.name];
            
            if (initialFieldVal !== newFieldVal) {
              if (field.type !== 'password' || confirm(`Are you sure you want to change ${field.label}?`)) {
                newVals = { ...newVals, ...{ [field.name]: newFieldVal } };
              }
            }
            return newVals;
          },
          {}
        );

        let submitPromise = new Promise(res => res());

        if (Object.keys(newVals).length) {
          submitPromise = dispatchProps.saveData({}, { values: newVals });
          submitPromise.then(dispatchProps.loadSystemSettings)
            .catch (ex => console.error(ex));
        }

        return submitPromise;
      },
      applySettings: () => {
        dispatchProps.applySettings(() => dispatchProps.loadSystemSettings());
      },
      solrReindex({ domain }) {
        alert('Reindex started. Please wait for it to complete');
        dispatchProps.toggleIsReindexing(domain.value, true);
        dispatchProps
          .solrReindex({ domain: domain.value })
          .then(() => alert(`${domain.label} reindex completed`))
          .catch(() => alert(`${domain.label} reindex failed`))
          .finally(() => dispatchProps.toggleIsReindexing(domain.value, false));
      },
    };
  }

  getFetchers({ params, state, dispatch }) {
    return {
      promise: actions.adminSettings.systemSettings.query,
    };
  }
}

export default SystemSettingsBuilder;
