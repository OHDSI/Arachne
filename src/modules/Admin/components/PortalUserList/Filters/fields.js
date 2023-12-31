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
 * Created: October 05, 2017
 *
 */

import {types as fieldTypes} from 'const/modelAttributes';

export default function getFields(props) {
  return [
    {
      label: 'Status',
      name: 'enabled',
      type: fieldTypes.enum,
      forceOpened: true,
      hasTitle: true,
      options: [
        {label: 'Enabled', value: 'true',},
        {label: 'Disabled', value: 'false',},
      ],
    },
    {
      label: 'E-mail confirmed',
      name: 'emailConfirmed',
      type: fieldTypes.enum,
      forceOpened: true,
      hasTitle: true,
      options: [
        {label: 'Yes', value: 'true',},
        {label: 'No', value: 'false',},
      ]
    },
    {
      label: 'Tenant',
      name: 'tenantIds',
      type: fieldTypes.enumMulti,
      forceOpened: true,
      hasTitle: true,
      options: props.tenantOptions,
    }
  ];
}