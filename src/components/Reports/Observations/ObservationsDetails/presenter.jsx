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

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Panel,
} from 'arachne-ui-components';
import {
  boxplot,
  donut,
  line,
  trellisline,
} from '@ohdsi/atlascharts';
import { numberFormatter } from 'services/Utils';
import * as d3 from 'd3';
import { chartSettings, defaultTrellisSet } from 'modules/DataCatalog/const';
import Chart from 'components/Reports/Chart';
import isEmpty from 'lodash/isEmpty';
import { chartTime } from 'const/formats';

function ConditionEraDetails(props) {
  const {
    conditionPrevalence,
    conditionByMonth,
    ageAtFirstOccurrence,
    observationsByType,
		conditionPrevalenceChart,
		conditionByMonthChart,
		observationsByTypeChart,
		ageAtFirstOccurrenceChart,
  } = props;
  const classes = new BEMHelper('report-death');

  return (  
    <div {...classes({ extra: 'row' })}>
      <div className='col-xs-12'>
        <Chart
          title='Condition Prevalence'
          isDataPresent={!isEmpty(conditionPrevalence)}
          render={({ width, element }) => {
            conditionPrevalenceChart.render(
              conditionPrevalence,
              element,
              width,
              width/3,
              {
                ...chartSettings,
                trellisSet: defaultTrellisSet,
                trellisLabel: 'Age Decile',
                seriesLabel: 'Year of Observation',
                yLabel: 'Prevalence Per 1000 People',
                xFormat: d3.timeFormat(chartTime),
                yFormat: d3.format('0.2f'),
                tickPadding: 20,
                colors: d3.scaleOrdinal()
                  .domain(['MALE', 'FEMALE'])
                  .range(['#1f77b4', '#ff7f0e'])
              }
            )
          }}
        />
      </div>
      <div className='col-xs-12'>
        <Chart
          title='Condition Prevalence by Month'
          isDataPresent={!isEmpty(conditionByMonth)}
          render={({ width, element }) => {
            conditionByMonthChart.render(
              conditionByMonth,
              element,
              width,
              width/3,
              {
                ...chartSettings,
                yLabel: 'Prevalence per 1000 People',
                xLabel: 'Date',
                yFormat: d => numberFormatter.format(d, 'short'),
                xFormat: d3.timeFormat('%m/%Y'),
                tickFormat: d3.timeFormat(chartTime),
                xScale: d3.scaleTime().domain(d3.extent(conditionByMonth[0].values, d => d.xValue)),
              }
            );
          }}
        />
      </div>
      <div className='col-xs-6'>
        <Chart
          title='Observations by type'
          isDataPresent={!isEmpty(observationsByType)}
          render={({ width, element }) => {
            observationsByTypeChart.render(
              observationsByType,
              element,
              width,
              width*0.75,
              {
                ...chartSettings,
                colors: d3.scaleOrdinal().range(d3.schemeCategory10),
              },
            );
          }}
        />
      </div>
      <div className='col-xs-6'>
        <Chart
          title='Age at first occurrence'
          isDataPresent={!isEmpty(ageAtFirstOccurrence)}
          render={({ width, element }) => {
            ageAtFirstOccurrenceChart.render(
              ageAtFirstOccurrence,
              element,
              width,
              width*0.75,
              {
                ...chartSettings,
                xLabel: 'Age at first occurrence',
                yLabel: 'Gender',
                yFormat: d => numberFormatter.format(d, 'short')
              },
            );
          }}
        />
      </div>
    </div>
  );
}

export default ConditionEraDetails;
