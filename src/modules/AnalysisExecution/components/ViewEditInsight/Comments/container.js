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
 * Created: May 11, 2017
 *
 */

import { connect } from 'react-redux';
import { get } from 'services/Utils';
import actions from 'actions/index';
import Comments from './presenter';
import selectors from './selectors';

function mapStateToProps(state, ownProps) {
  const isLoading = get(state, 'analysisExecution.insightComments.isLoading', false);
  const commentData = selectors.getCommentData(state);

  return {
    isRecentComments: commentData.isRecent,
    commentGroupList: commentData.commentGroupList,
    isLoading,
    submissionId: ownProps.submissionId,
  };
}

const mapDispatchToProps = {
  loadComments: actions.analysisExecution.insightComments.query,
  unloadComments: actions.analysisExecution.insightComments.unload,
  unloadFile: actions.analysisExecution.insightFile.unload,
  selectFile: actions.analysisExecution.insightFile.select
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    loadComments: (file) => {
      dispatchProps
        .loadComments({ commentTopicId: file.commentTopicId })
        .then(() => dispatchProps.selectFile(file));
    },
  });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Comments);
