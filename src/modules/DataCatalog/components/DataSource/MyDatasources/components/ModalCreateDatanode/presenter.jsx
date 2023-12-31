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
  * Created: Wednesday, February 14, 2018 3:07 PM
  *
  */

import React from 'react';
import { Modal } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import FormCreateDataNode from 'modules/DataCatalog/components/DataSource/ViewEdit/Edit/FormCreateDataNode';

import './style.scss';

function ModalCreateDatanode(props) {
  const classes = new BEMHelper('modal-create-datanode');
  const {
    createDataNode,
    createOrganization,
    doSubmit,
  } = props;

  return (
    <Modal
      modal={props.modal}
      title="Create Data node"
      mods={['no-padding']}
      create
    >
      <div {...classes()}>
        <FormCreateDataNode doSubmit={doSubmit} />
      </div>
    </Modal>
  );
}

export default ModalCreateDatanode;
