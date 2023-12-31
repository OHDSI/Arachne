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
 * Created: November 09, 2017
 *
 */

import ReportUtils from 'components/Reports/Utils';
import {
  convertDataToBoxplotData,
} from 'components/Reports/converters';
import { ContainerBuilder } from 'services/Utils';
import {
  boxplot,
  line,
} from '@ohdsi/atlascharts';
import { BaseChart } from 'components/Reports/BaseChart';
import presenter from './presenter';

class DataDensity extends BaseChart {
  render() {
    return presenter(this.props);
  }
}

export default class DataDensityChartBuilder extends ContainerBuilder {

  constructor() {
    super();
    this.detailsCharts = {
      totalRecordsChart: new line(),
      recordsPerPersonChart: new line(),
      conceptsPerPersonChart: new boxplot(),
    }
  }

  getComponent() {
    return DataDensity;
  }

  mapStateToProps(state, ownProps) {
    const {
      totalRecords: rawTotalRecords,
      conceptsPerPerson,
      recordsPerPerson: rawRecordsPerPerson,

    } = ownProps;

    const {
      transformedData: totalRecords,
      normalizedData: totalRecordsScale,
    } = ReportUtils.prepareLineData(rawTotalRecords);

    const {
      transformedData: recordsPerPerson,
      normalizedData: perPersonScale,
    } = ReportUtils.prepareLineData(rawRecordsPerPerson);


    return {
      conceptsPerPerson:
        convertDataToBoxplotData(
          conceptsPerPerson,
        ),
      recordsPerPerson,
      recordsPerPersonYears: perPersonScale,
      totalRecords,
      totalRecordsYears: totalRecordsScale,
      detailsCharts: this.detailsCharts,
    };
  }
}