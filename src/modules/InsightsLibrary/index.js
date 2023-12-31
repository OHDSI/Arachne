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
 * Created: July 17, 2017
 *
 */

import { imgs } from './const';
import ducks from './ducks';
import { paths } from './const';

export default {
  actions: () => ducks.actions,
  reducer: () => ducks.reducer,
  routes: () => (location, cb) => {
    require.ensure([], (require) => {
      cb(null, require('./routes').default()); // eslint-disable-line global-require
    });
  },
  sidebarElement: {
    ico: imgs.sidebarIco,
    name: 'Insights Library',
    path: paths.insights(),
    indexRedirect: '/insights',
  },
};
