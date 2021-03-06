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
import BEMHelper from 'services/BemHelper';
import {
  LoadingPanel,
  PageContent,
} from 'arachne-ui-components';
import { modelTypesValues } from 'const/dataSource';
import Toolbar from './Toolbar';
import AchillesSettings from './AchillesSettings';
import Banner from './Banner';

require('./style.scss');

function ViewEdit({ isLoading, dataSourceName, published, modelType }) {
  const classes = new BEMHelper('cdm-data-source');
  const reportsAvailable = modelType === modelTypesValues.CDM && published;

  return (
    <PageContent title={`${dataSourceName} | Arachne`}>
      <div {...classes()}>
        <Banner disabled={reportsAvailable} />
        <Toolbar />
        <div {...classes('content')}>
          <div {...classes({ element: 'row', extra: 'row' })}>
            <div className="col-xs-12 col-md-6">
              <AchillesSettings />
            </div>
          </div>
        </div>
        <LoadingPanel active={isLoading} />
      </div>
    </PageContent>
  );
}

export default ViewEdit;
