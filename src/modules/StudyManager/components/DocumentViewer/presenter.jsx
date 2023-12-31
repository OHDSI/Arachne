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

import React from 'react';
import FileViewer from 'components/FileViewer';

function StudyDocumentViewer({
  file,
  isLoading,
  toolbarOpts,
  downloadLink,
  urlParams,
  pageTitle,
  queryParams,
}) {
  return (
    <FileViewer
      file={file}
      isLoading={isLoading}
      toolbarOpts={toolbarOpts}
      downloadLink={downloadLink}
      urlParams={urlParams}
      pageTitle={pageTitle}
      queryParams={queryParams}
    />
  );
}

export default StudyDocumentViewer;
