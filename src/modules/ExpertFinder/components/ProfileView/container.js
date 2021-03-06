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
 * Created: January 16, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { ModalUtils } from 'arachne-ui-components';
import { get } from 'services/Utils';
import { modal } from 'modules/ExpertFinder/const';
import actions from 'actions';
import { goBack } from 'react-router-redux';
import { ContainerBuilder, isViewable } from 'services/Utils';
import presenter from './presenter';


class ProfileView extends Component {

  componentWillReceiveProps(props) {
    if (this.props.id !== props.id) {
      this.props.loadInfo({ id: props.id });
    }
  }

  render() {
    return presenter(this.props);
  }
}

ProfileView.propTypes = {
  loadInfo: PropTypes.func,
  id: PropTypes.string,
};

export default class ProfileViewBuilder extends ContainerBuilder {
  getComponent() {
    return ProfileView;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = state.expertFinder.userProfile;
    const isLoading = get(moduleState, 'isLoading', false);
    const isCreatingSkill = get(state.expertFinder, 'skills.isLoading', false);
    let firstname = get(moduleState, 'data.result.general.firstname', '');
    const lastname = get(moduleState, 'data.result.general.lastname', '');
    const middlename = get(moduleState, 'data.result.general.middlename', '');
    const id = ownProps.routeParams.userId;
    const editable = get(moduleState, 'data.result.isEditable', false);
    if (!firstname && !middlename && !lastname) {
      firstname = 'an expert';
    }
    const canView = isViewable(moduleState.data);

    return {
      editable,
      name: [firstname, middlename, lastname].filter(val => !!val).join(' '),
      id,
      isLoading: isLoading || isCreatingSkill,
      canView,
    };
  }

  getMapDispatchToProps() {
    return {
      loadInfo: actions.expertFinder.userProfile.find,
      showNameEditDialog: () => ModalUtils.actions.toggle(modal.nameEdit, true),
      showInviteDialog: user => ModalUtils.actions.toggle(modal.invite, true, { ...user }),
      goBack,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      invite: () => {
        dispatchProps.showInviteDialog({
          id: stateProps.id,
          general: {
            firstname: stateProps.firstname,
            lastname: stateProps.lastname,
            middlename: stateProps.middlename,
          },
        });
      },
    };
  }
  getFetchers({ params, state, dispatch }) {
    return {
      loadInfo: actions.expertFinder.userProfile.find.bind(null, ({ id: params.userId })),
    };
  }

}
