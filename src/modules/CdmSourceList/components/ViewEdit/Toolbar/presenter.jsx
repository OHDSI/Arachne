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
 * Created: December 28, 2016
 *
 */

import React from 'react';
import { Toolbar } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function Status({ published }) {
  const classes = new BEMHelper('cdm-data-source-status');
  const modifiers = { registered: published };

  return (
    <div {...classes({ modifiers })}>
      <span {...classes('label')}>Status:</span>
      <span {...classes('value')}>
        {published ? 'Published' : 'Not published'}
      </span>
    </div>
  );
}

function ViewEditSourceToolbar({ backUrl, published, name }) {
  return (
    <Toolbar caption={name} backUrl={backUrl}>
      <Status published={published} />
    </Toolbar>
  );
}

export default ViewEditSourceToolbar;
