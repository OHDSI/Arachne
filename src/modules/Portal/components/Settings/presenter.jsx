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
 * Created: April 26, 2017
 *
 */

import React, { Component } from 'react';
import BEMHelper from 'services/BemHelper';
import { LoadingPanel, PageContent, Toolbar } from 'arachne-ui-components';

import FormPassword from './FormPassword';

require('./style.scss');

export const classes = new BEMHelper('portal-settings');

export default class Settings extends Component {

    getSettingsComponents(){
        return [<FormPassword {...classes('panel')} />];
    }

    renderContent() {
        return (
            this.getSettingsComponents().map((control, idx) =>
                <div className="row" key={idx}>
                    <div className="col-xs-12 col-md-4">
                        {control}
                    </div>
                </div>
            )
        )
    }

    render() {
        return (
            <PageContent title='Settings | Arachne'>
                <div {...classes()}>
                    <Toolbar
                        caption={'Settings'}
                    />
                    <div {...classes('content')}>
                        {this.renderContent()}
                    </div>
                    <LoadingPanel active={false}/>
                </div>
            </PageContent>
        );
    }
}
