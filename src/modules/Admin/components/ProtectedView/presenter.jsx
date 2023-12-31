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
 * Authors: Anastasiia Klochkova
 * Created: December 09, 2019
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function ProtectedView(props) {
  const { children, isAdmin } = props;
  const classes = new BEMHelper('admin-settings-warning');
  if (!isAdmin) {
    return <div {...classes('access-denied-title')}>The page you're looking for can't be found</div>;
  }
  return (
      <div  {...classes()}>
        {children}
      </div>
  );
}


export default ProtectedView;