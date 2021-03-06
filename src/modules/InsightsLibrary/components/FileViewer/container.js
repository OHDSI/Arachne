/*
 *  Copyright 2018 Odysseus Data Services, inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  Company: Odysseus Data Services, Inc.
 *  Product Owner/Architecture: Gregory Klebanov
 *  Authors: Anton Gackovka
 *  Created: October 19, 2017
 *
 */

import { get, ContainerBuilder } from 'services/Utils';
import actions from 'actions/index';
import { apiPaths, paths } from 'modules/InsightsLibrary/const';
import { FileLoader } from 'services/FileLoader';
import presenter from './presenter';

class FileViewer extends FileLoader {
  render() {
    return presenter(this.props);
  }
}

export default class InsightFileViewerBuilder extends ContainerBuilder {

  getComponent() {
    return FileViewer;
  }

  mapStateToProps(state, ownProps) {

    const fileUuid = ownProps.routeParams.fileUuid;
    const insightId = ownProps.routeParams.insightId;
    const isFileLoading = get(state, 'insightsLibrary.insightFiles.isLoading', false);

    const insightFile = get(state, 'insightsLibrary.insightFiles.data');

    const pageTitle = [get(insightFile, 'name', 'Insight document file'),'Arachne'];

    const urlParams = { fileUuid, insightId };
    const queryParams = ownProps.location.query;

    const backUrl = paths.insights({ insightId: get(insightFile, 'insightId') });
    const toolbarOpts = {
      backUrl,
      breadcrumbList: [
        {
          label: 'Insights',
          link: paths.insights(),
        },
        {
          label: 'Study',
          link: paths.studies(get(insightFile, 'studyId', '', 'String')),
        },
        {
          label: 'Insight',
          link: backUrl,
        },
      ],
      title: get(insightFile, 'label') || get(insightFile, 'name'),
    };

    return {
      file: insightFile,
      urlParams,
      queryParams,
      isLoading: isFileLoading,
      pageTitle: pageTitle.join(' | '),
      downloadLink: apiPaths.insightFilesDownload({ ...urlParams, query: queryParams }),
      toolbarOpts,
    };
  }

  getMapDispatchToProps() {
    return {
      loadFile: actions.insightsLibrary.insightFiles.find,
    };
  }
}
