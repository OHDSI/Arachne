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
 * Created: December 13, 2016
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import { dataSourceStatuses, paths, studyPermissions } from 'modules/StudyManager/const';

export default class selectorsBuilder {
  getStudyId(state) {
    return get(state, 'studyManager.study.data.id') || [];
  }

  getRawDataSourceList(state) {
    return get(state, 'studyManager.study.data.dataSources') || [];
  }

  hasAttachPermissions(state) {
    return get(
      state,
      `studyManager.study.data.permissions[${studyPermissions.inviteDatanode}]`,
      false
    );
  }

  hasDeletePermissions(state) {
    return get(
      state,
      `studyManager.study.data.permissions[${studyPermissions.unlinkDatasource}]`,
      false
    );
  }

  hasEditStudyPermissions(state) {
    return get(
      state,
      `studyManager.study.data.permissions[${studyPermissions.editStudy}]`,
      false
    );
  }

  isDeleted(dataSource) {
    return dataSource.status.toLowerCase() === dataSourceStatuses.DELETED.toLowerCase();
  }

  getStatus(dataSource) {
    let status = dataSource.status.toLowerCase();
    if (status === 'deleted') {
      status = 'suspended';
    }
    return status;
  }

  getDataSourceList(studyId, dataSourceList, attachPermissions, deletePermissions) {
    return dataSourceList.map(dataSource => ({
        id: dataSource.id,
        name: `${get(dataSource, 'dataNode.name', '')}: ${dataSource.name}`,
        link: paths.dataSources(dataSource.id),
        status: this.getStatus(dataSource),
        healthStatus: {
          value: dataSource.healthStatus,
          title: dataSource.healthStatusTitle,
        },
        canBeRemoved: !this.isDeleted(dataSource) && deletePermissions,
        canBeRecreated: dataSource.canBeRecreated && this.isDeleted(dataSource) && attachPermissions,
        comment: dataSource.comment,
        isVirtual: dataSource.dataNode.virtual,
        isCurrentUserOwner: dataSource.dataNode.currentUserDataOwner,
      }));
  }

  buildselectorForDataSourceList() {
    return createSelector(
      [
        this.getStudyId,
        this.getRawDataSourceList,
        this.hasAttachPermissions,
        this.hasDeletePermissions,
        this.hasEditStudyPermissions,
      ],
      this.getDataSourceList.bind(this)
    );
  }

  build() {
    return {
      getDataSourceList: this.buildselectorForDataSourceList(),
      hasAttachPermissions: this.hasAttachPermissions,
      hasDeletePermissions: this.hasDeletePermissions,
      hasEditStudyPermissions: this.hasEditStudyPermissions,
    };
  }
}
