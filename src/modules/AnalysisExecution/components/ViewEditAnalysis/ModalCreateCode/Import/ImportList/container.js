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
 * Created: July 26, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, reset as resetForm, } from 'redux-form';
import { ModalUtils } from 'arachne-ui-components';
import { get } from 'services/Utils';
import actions from 'actions';
import { form, modal } from 'modules/AnalysisExecution/const';
import presenter from './presenter';
import selectors from './selectors';

class ImportList extends Component {
    constructor() {
        super();
        this.state = {
            filterText: '',
        };
        this.filter = this.filter.bind(this);
    }

    filter(filterText) {
        this.setState({
            filterText,
        });
    }

    render() {
        return presenter({
            ...this.props,
            ...this.state,
            filter: this.filter,
        });
    }
}

ImportList.propTypes = {
    selectedSource: PropTypes.shape({
        id: PropTypes.number,
    }),
    analysisType: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
    const analysisType = get(state, 'analysisExecution.analysis.data.result.type.id', '', 'String');
    const selectedSource = get(ownProps, 'selectedSource', {}, 'Object');
    const selectedEntity = selectors.getFormEntity(state);

    return {
        selectedSource,
        isAnySelected: selectedEntity,
        entities: selectors.getList(state),
        totalSteps: ownProps.totalSteps,
        step: ownProps.step,
        goBack: ownProps.goBack,
        analysisId: get(state, 'analysisExecution.analysis.data.result.id', 'Number'),
        analysisType,
    };
}

const mapDispatchToProps = {
    importEntities: actions.analysisExecution.importEntity.create,
    closeModal: () => ModalUtils.actions.toggle(modal.createCode, false),
    loadAnalysis: actions.analysisExecution.analysis.find,
    openUpdateDescriptionModal: newDescription => ModalUtils.actions.toggle(modal.updateAnalysisDescription, true, {newDescription}),
    reset: () => resetForm(form.importCodeList),
    showModalError: params => ModalUtils.actions.toggle(modal.modalError, true, params),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        async doSubmit({entity}) {
            // TEMP. TODO!
            const datanodeId = stateProps.selectedSource.id;
            const entityGuid = entity;

            async function handleImportAnalysis(importResponse) {
                await dispatchProps.reset();
                await dispatchProps.closeModal();
                return importResponse.result;
            }

            async function handleDescriptionUpdate(newDescription) {
                if (!!newDescription) {
                    await dispatchProps.openUpdateDescriptionModal(newDescription);
                }
            }

            try {
                const importResult = await dispatchProps.importEntities(
                    {
                        analysisId: stateProps.analysisId,
                        type: stateProps.analysisType,
                    },
                    {
                        dataNodeId: datanodeId,
                        entityGuid,
                    }
                );

                const newDescription = await handleImportAnalysis(importResult);
                await handleDescriptionUpdate(newDescription);
                await dispatchProps.loadAnalysis({id: stateProps.analysisId});

            } catch (error) {
                const errors = get(error, `errors.${entityGuid}`);
                if (errors) {
                    await dispatchProps.showModalError({
                        title: 'Unsuccessful import',
                        errors,
                    });
                }

            }
        },
    };
}

const ReduxImportList = reduxForm({
    form: form.importCodeList,
})(ImportList);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(ReduxImportList);
