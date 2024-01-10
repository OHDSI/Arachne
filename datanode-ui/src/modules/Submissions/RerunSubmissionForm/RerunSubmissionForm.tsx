/*
 *
 * Copyright 2023 Odysseus Data Services, Inc.
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
 */

import React, { memo, useEffect, useState, } from "react";
import { useTranslation } from "react-i18next";

import { AnalysisTypes, CreateSubmissionFormTabs, Status } from "../../../libs/enums";

import {
  Block,
  Button,
  FormActionsContainer,
  FormElement,
  Grid,
  Icon,
  Input,
  Select,
  Spinner,
  useNotifications
} from "../../../libs/components";

import { getAnalysisTypes, getEnvironments, getSubmission, updateSubmission } from "../../../api/submissions";
import { getDataSources, removeDataSource } from "../../../api/data-sources";
import { DataSourceDTOInterface, DescriptorInterface, EnvironmentInterface, IdNameInterface, SelectInterface } from "../../../libs/types";
import { parseToSelectControlOptions } from "../../../libs/utils";
import { useEntity } from "../../../libs/hooks";
import { SpinnerFormContainer } from "../CreateSubmissionForm/ChooseRuntime.styles";

const defaultState = (type = AnalysisTypes.COHORT): SubmissionFormStateInterface => ({
  title: "",
  executableFileName: "",
  study: "",
  environmentId: "",
  datasourceId: "",
  type: type
});

interface SubmissionFormStateInterface {
  executableFileName: string;
  study: string;
  type: AnalysisTypes;
  environmentId: string;
  datasourceId: string;
  title: string;
}

interface CreateSubmissionFormInterfaceProps {
  afterCreate: (analysis: any) => void;
  onCancel: () => void;
  createMethod: (typeFile: CreateSubmissionFormTabs, data: any) => Promise<any>;
  isRerun?: boolean;
  id: string;
}

interface ControlListInterfaceState {
  status: Status;
  envs: SelectInterface<number>[];
  analysisTypes: SelectInterface<AnalysisTypes>[];
  dataSources: SelectInterface<number>[];
  entryFiles: SelectInterface<string>[];
}

export const RerunSubmissionForm: React.FC<CreateSubmissionFormInterfaceProps> = memo(props => {
  const { afterCreate, onCancel, id } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useNotifications();
  const [state, setState] = useState<SubmissionFormStateInterface>(defaultState(null));
  const [controlsList, setControlsList] = useState<ControlListInterfaceState>({
    status: Status.INITIAL,
    envs: [],
    analysisTypes: [],
    dataSources: [],
    entryFiles: [],
  });

  const { entity, status } = useEntity<any>(
    {
      get: getSubmission,
      update: updateSubmission,
      delete: removeDataSource,
    },
    id
  );

  useEffect(() => {
    if (status === Status.SUCCESS) {
      setState(entity);
    }
  }, [status, entity]);

  useEffect(() => {
    setControlsList(prevState => ({ ...prevState, status: Status.IN_PROGRESS }));
    getControlsList();
  }, []);

  const getControlsList = async () => {
    try {
      const environments: EnvironmentInterface = await getEnvironments();
      const envs: DescriptorInterface[] = environments.descriptors;
      const types: IdNameInterface<AnalysisTypes>[] = await getAnalysisTypes();
      const dataSources: DataSourceDTOInterface[] = await getDataSources();

      setControlsList(prevState => ({
        ...prevState,
        status: Status.SUCCESS,
        envs: parseToSelectControlOptions(envs, "label"),
        analysisTypes: parseToSelectControlOptions(types),
        dataSources: parseToSelectControlOptions(dataSources)
      }));

    } catch (e) {
      setControlsList(prevState => ({ ...prevState, status: Status.ERROR }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateSubmission(id, state);
      enqueueSnackbar({
        message: t("forms.rerun_submission.success_message"),
        variant: "success",
      } as any);
      setIsLoading(false);
      afterCreate?.(result);
    } catch (e) {
      enqueueSnackbar({
        message: t("forms.rerun_submission.error_message"),
        variant: "error",
      } as any);
    }
  };

  return (

    <Grid container p={2}>
      {(status === Status.IN_PROGRESS || controlsList.status === Status.IN_PROGRESS) && (
        <SpinnerFormContainer>
          <Spinner size={50} />
        </SpinnerFormContainer>
      )}
      <Block>
        <Grid item container xs={12} p={2} spacing={2}>
          <Grid item xs={12}>
            <FormElement name="type" textLabel={t("forms.create_submission.entry_point")} required>
              <Input
                id="entry"
                name="entry"
                type="text"
                size="medium"
                disabled={true}
                value={state.executableFileName}
                placeholder={t("forms.create_submission.entry_point_placeholder")}
                onChange={(e: any) => {
                  setState({
                    ...state,
                    title: e.target.value,
                  });
                }}
                fullWidth
              />
            </FormElement>
          </Grid>
          <Grid item xs={12}>
            <FormElement
              name="env"
              textLabel={t("forms.create_submission.env")}
              required
            >
              <Select
                className=""
                name="env"
                disablePortal
                id="env"
                disabled={controlsList?.envs?.length === 0}
                options={controlsList.envs}
                value={state.environmentId}
                placeholder={t("forms.create_submission.env_placeholder")}
                onChange={(env: any) => {
                  setState({
                    ...state,
                    environmentId: env,
                  });
                }}
                fullWidth
              />
            </FormElement>
          </Grid>
          <Grid item xs={12}>
            <FormElement
              name="data-source"
              textLabel={t("forms.create_submission.data_source")}
              required
            >
              <Select
                className=""
                name="data-source"
                disablePortal
                id="data-source"
                disabled={controlsList?.dataSources?.length === 0}
                options={controlsList.dataSources}
                value={state.datasourceId}
                placeholder={t("forms.create_submission.data_source_placeholder")}
                onChange={(dataSourceId: any) => {
                  setState({
                    ...state,
                    datasourceId: dataSourceId,
                  });
                }}
                fullWidth
              />
            </FormElement>
          </Grid>
          <Grid item xs={12}>
            <FormElement
              name="analysis-name"
              textLabel={t("forms.create_submission.analysis_name")}
              required
            >
              <Input
                id="analysis-name"
                name="analysis-name"
                type="text"
                size="medium"
                value={state.title}
                placeholder={t("forms.create_submission.analysis_name_placeholder")}
                disabled={true}
                onChange={(e: any) => {
                  setState({
                    ...state,
                    title: e.target.value,
                  });
                }}
                fullWidth
              />
            </FormElement>
          </Grid>
          <Grid item xs={12}>
            <FormElement name="type" textLabel={t("forms.create_submission.analysis_type")} required>
              <Select
                className=""
                name="type"
                disablePortal
                id="type"
                disabled={true}
                options={controlsList.analysisTypes}
                value={state.type}
                placeholder={t("forms.create_submission.analysis_type_placeholder")}
                onChange={(type: any) => {
                  setState({
                    ...state,
                    type: type,
                  });
                }}
                fullWidth
              />
            </FormElement>
          </Grid>
          <Grid item xs={12}>
            <FormActionsContainer>
              <Button
                variant="outlined"
                disabled={isLoading}
                onClick={onCancel}
                size="small"
                startIcon={<Icon iconName="deactivate" />}
              >
                {t("common.buttons.cancel")}
              </Button>
              <Button
                disabled={isLoading}
                onClick={handleSave}
                variant="contained"
                size="small"
                color="success"
                startIcon={
                  !isLoading ? (
                    <Icon iconName="submit" />
                  ) : (
                    <Spinner size={16} />
                  )
                }
              >
                {t("common.buttons.rerun")}
              </Button>
            </FormActionsContainer>
          </Grid>
        </Grid>
      </Block>
    </Grid>
  );
});
