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
 * Authors: Alexander Saltykov
 * Created: November 20, 2017
 *
 */


import { ContainerBuilder } from 'services/Utils';
import {
  convertDataToTableData,
} from 'components/Reports/converters';
import CohortspecificReport from './presenter';

function mapRow(concept, normalData, index) {
  return {
    age: {
      value: normalData.covariance[index],
    },
    gender: {
      value: normalData.genderP[index],
    },
    race: {
      value: normalData.raceP[index],
    },
    ethnicity: {
      value: normalData.ethP[index],
    },
  };
}

const tableColumns = {
  age: 'Age',
  gender: 'Gender (%)',
  race: 'Race (%)',
  ethnicity: 'Ethnicity (%)',
};

export default class CohortspecificReportBuilder extends ContainerBuilder {
  getComponent() {
    return CohortspecificReport;
  }

  mapStateToProps(state, ownProps) {
    const {
      recordsPerPerson,
    } = ownProps;

    const tableData = convertDataToTableData(recordsPerPerson, mapRow, {
      path: 'covariance',
    });

    return {
      tableData,
      tableColumns,
    };
  }
}
