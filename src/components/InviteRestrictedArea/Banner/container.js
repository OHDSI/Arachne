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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon
 * Created: December 11, 2017
 *
 */

import { ContainerBuilder } from 'services/Utils';
import { modal } from 'modules/Portal/const';
import { ModalUtils } from 'arachne-ui-components';
import Banner from './presenter';


export default class BannerBuilder extends ContainerBuilder {
  getComponent() {
    return Banner;
  }

  mapStateToProps(state) {
    return {};
  }

  getMapDispatchToProps() {
    return {
      showDeclineModal: invite => ModalUtils.actions.toggle(
        modal.rejectInvitation,
        true,
        {
          invitationId: invite.id,
          invitationType: invite.type,
        }
      ),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      showDeclineModal: () => dispatchProps.showDeclineModal(ownProps.invitation),
    };
  }
}
