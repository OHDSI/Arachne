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

import React, { memo, useEffect, useMemo, useState, } from "react";
import { useTranslation } from "react-i18next";
import { SpinnerFormContainer } from "./ChooseRuntime.styles";
import { AnalysisTypes, CreateSubmissionFormTabs, Status } from "../../../libs/enums";

import {
  AutocompleteInput,
  Block,
  Button,
  FormActionsContainer,
  FormElement,
  Grid,
  Icon,
  ImportJsonFile,
  ImportZipFile,
  Input,
  Select,
  Spinner,
  TabsNavigationNew,
  useNotifications
} from "../../../libs/components";
import { Box, Paper, Switch } from "@mui/material";
import { getAnalysisTypes, getEnvironments } from "../../../api/submissions";
import { getDataSources } from "../../../api/data-sources";
import { DataSourceDTOInterface, EnvironmentInterface, IdNameInterface, SelectInterface } from "../../../libs/types";
import { parseToSelectControlOptions } from "../../../libs/utils";
import { tabsSubmissionForm } from "../../../config";

const defaultState = (type): SubmissionFormStateInterface => ({
  title: "",
  executableFileName: "",
  study: "",
  environmentId: "",
  datasourceId: "",
  type: type,
});

interface SubmissionFormStateInterface {
  executableFileName: string;
  study: string;
  type: AnalysisTypes;
  environmentId?: string;
  datasourceId: string;
  title: string;
  dockerImage?: string;
}

interface CreateSubmissionFormInterfaceProps {
  afterCreate: (analysis: any) => void;
  onCancel: () => void;
  createMethod: (typeFile: CreateSubmissionFormTabs, data: any) => Promise<any>;
  isRerun?: boolean;
}

interface Envs {
  docker: any[];
  tarball: SelectInterface[];
}

interface ControlListInterfaceState {
  status: Status;
  analysisTypes: SelectInterface<AnalysisTypes>[];
  dataSources: SelectInterface<number>[];
  entryFiles: SelectInterface<string>[];
}

export const CreateSubmissionForm: React.FC<CreateSubmissionFormInterfaceProps> =
  memo(props => {
    const { afterCreate, onCancel, createMethod } = props;
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { enqueueSnackbar } = useNotifications();
    const [state, setState] = useState<SubmissionFormStateInterface>(defaultState(null));
    const [envs, setEnvs] = useState<Envs>({ docker: null, tarball: [] });
    const [isDockerEnv, setIsDockerEnv] = useState(true);
    const [controlsList, setControlsList] = useState<ControlListInterfaceState>({
      status: Status.INITIAL,
      analysisTypes: [],
      dataSources: [],
      entryFiles: [],
    });

    const [status, setStatus] = useState(Status.INITIAL);
    const [fileState, setFileState] = useState<any>();
    const [activeTab, setActiveTab] = useState<CreateSubmissionFormTabs>(
      CreateSubmissionFormTabs.FILES_IN_ARCHIVE
    );

    const tabs = React.useMemo(() => tabsSubmissionForm(t, setActiveTab), [t, setActiveTab]);

    useEffect(() => {
      setControlsList(prevState => ({ ...prevState, status: Status.IN_PROGRESS }));
      getControlsList();
    }, []);

    useEffect(() => {
      setState(defaultState(activeTab === CreateSubmissionFormTabs.SEPARATE_FILES ? AnalysisTypes.STRATEGUS : AnalysisTypes.CUSTOM));
    }, [activeTab]);

    const showTypesEnv = useMemo(() => {
      return {
        showDocker: ![undefined, null].includes(envs.docker),
        showTarball: !!envs.tarball
      }
    }, [envs]);

    const getControlsList = async () => {
      try {
        const environments: EnvironmentInterface = await getEnvironments();
        const types: IdNameInterface<AnalysisTypes>[] = await getAnalysisTypes();
        const dataSources: DataSourceDTOInterface[] = await getDataSources();

        const envsSelectControlList = environments.docker?.map(elem => ({
          name: elem.tags.join(','),
          value: elem.tags.join(',')
        }))

        setEnvs(() => ({
          docker: envsSelectControlList || [],
          tarball: parseToSelectControlOptions(environments.tarball, "label")
        }));

        setControlsList(prevState => ({
          ...prevState,
          status: Status.SUCCESS,
          analysisTypes: parseToSelectControlOptions(types),
          dataSources: parseToSelectControlOptions(dataSources),
        }));

        setState(prevState => ({...prevState, dockerImage: envsSelectControlList.length == 0 ? envsSelectControlList[0].value : ""}))

      } catch (e) {
        setControlsList(prevState => ({ ...prevState, status: Status.ERROR }));
      }
    };

    const handleSave = async () => {
      setIsLoading(true);
      setStatus(Status.IN_PROGRESS);
      try {
        const fd = new FormData();
        const stateForSave: any = {
          title: state.title,
          datasourceId: state.datasourceId,
          executableFileName: state.executableFileName,
          study: state.study,
          type: state.type
        }

        fd.append("file", fileState);

        if (isDockerEnv) {
          stateForSave.dockerImage = state.dockerImage
        }

        if (!isDockerEnv) {
          stateForSave.environmentId = state.environmentId
        }

        const str = JSON.stringify(stateForSave);
        const bytes = new TextEncoder().encode(str);
        const blob = new Blob([bytes], {
          type: "application/json"
        });
        fd.append("analysis", blob);

        const result = await createMethod(activeTab, fd);
        setStatus(Status.SUCCESS);
        enqueueSnackbar({
          message: t("forms.create_submission.success_message"),
          variant: "success",
        } as any);
        setIsLoading(false);
        afterCreate?.(result);
      } catch (e) {
        setIsLoading(false);
        setStatus(Status.INITIAL);
        enqueueSnackbar({
          message: t("forms.create_submission.error_message"),
          variant: "error",
        } as any);
      }
    };

    const isValid = useMemo(() => {
      return state.datasourceId &&
        state.type &&
        state.executableFileName
    }, [state, activeTab]);

    const unpackZip = (zipFolder) => {
      return Object.keys(zipFolder.files)
        .map(fileId => zipFolder.files[fileId])
        .filter(file => {
          return !(file.name.indexOf('_') === 0 || file.name.indexOf('.') === 0)
        })
        .filter(file => {
          return (
            file.name.toLowerCase().includes(".sql", -5) ||
            file.name.toLowerCase().includes(".r", -5)
          );
        })
        .map(file => {
          const filename = file.name.split('/')
          if(filename.length > 1) {
            filename.shift()
          }
          return {
            name: filename.join('/').toLowerCase(),
            value: filename.join('/').toLowerCase(),
          };
        });
    };

    const getAnalysisName = (zip: any) => {
      const analysisName = zip.name.split(".");
      analysisName.pop();

      return analysisName;
    };

    return (
      <Grid container>
        <Paper elevation={3} sx={{ zIndex: 2, px: 2, width: "100%" }}>
          <TabsNavigationNew tabs={tabs} active={activeTab} />
        </Paper>

        <Grid container p={2}>
          {status === Status.IN_PROGRESS && (
            <SpinnerFormContainer>
              <Spinner size={50} />
            </SpinnerFormContainer>
          )}
          <Block>
            <Grid item container xs={12} p={2} spacing={2}>
              {activeTab === CreateSubmissionFormTabs.FILES_IN_ARCHIVE && (
                <>
                  <Grid item xs={12}>
                    <ImportZipFile titleButton={t("forms.create_submission.files_in_archive.upload")} onChange={(zipFolder: any, zip: any, metadata: any) => {

                      if (zip) {
                        const analysisName = getAnalysisName(zip);

                        setControlsList(prevState => ({
                          ...prevState,
                          entryFiles: unpackZip(zipFolder)
                        }));

                        setState(prevState => {
                          return metadata ? {
                            ...prevState,
                            title: metadata.analysisName,
                            study: metadata.studyName,
                            dockerImage: metadata.dockerRuntimeEnvironmentImage,
                            type: metadata.analysisType,
                            executableFileName: metadata.entryPoint.toLowerCase(),
                            environmentId: metadata.runtimeEnvironmentName
                          } : {
                            ...prevState,
                            title: analysisName.join(),
                          }
                        });
                      } else {
                        setControlsList(prevState => ({
                          ...prevState,
                          entryFiles: []
                        }));

                        setState({
                          ...state,
                          title: null,
                        });
                      }

                      setFileState(zip);
                    }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormElement name="type" textLabel={t("forms.create_submission.entry_point")} required>
                      <Select
                        className=""
                        name="entry-point"
                        disablePortal
                        id="entry point"
                        disabled={controlsList?.entryFiles?.length === 0}
                        options={controlsList.entryFiles}
                        value={state.executableFileName}
                        placeholder={t("forms.create_submission.entry_point_placeholder")}
                        onChange={(type: any) => {
                          setState({
                            ...state,
                            executableFileName: type,
                          });
                        }}
                        fullWidth
                      />
                    </FormElement>
                  </Grid>
                </>
              )}
              {activeTab === CreateSubmissionFormTabs.SEPARATE_FILES && (
                <Grid item xs={12}>
                  <ImportJsonFile titleButton={t("forms.create_submission.separate_files.upload")} onChange={(parsedJson: any, file: any) => {
                    if (file) {
                      const analysisName = getAnalysisName(file);

                      setState({
                        ...state,
                        title: analysisName.join(),
                        executableFileName: file.name
                      });
                    } else {

                      setState({
                        ...state,
                        title: null,
                        executableFileName: null
                      });
                    }

                    setFileState(file);
                  }} />
                </Grid>
              )}
              <Grid
                item
                display="flex"
                pr={2}
                lineHeight="30px"
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <Box
                  component="label"
                  htmlFor="restrict-initial-event"
                  sx={[
                    isDockerEnv ? { opacity: 0.3 } : {},
                    { color: 'primary.main', fontWeight: 'bold' },
                  ]}
                >
                  Tarball environment
                </Box>
                <Grid item px={1}>
                  <Switch
                    id="restrict-initial-event"
                    value={isDockerEnv}
                    checked={isDockerEnv}
                    onChange={e => {
                      setIsDockerEnv(prevState => !prevState);
                    }}
                    size="small"
                    color="info"
                  />
                </Grid>
                <Box
                  component="label"
                  htmlFor="restrict-initial-event"
                  sx={[
                    isDockerEnv ? {} : { opacity: 0.3 },
                    { color: 'primary.main', fontWeight: 'bold' },
                  ]}
                >
                  Docker environment
                </Box>
              </Grid>
              {!showTypesEnv.showDocker && !showTypesEnv.showTarball && (
                <Grid item xs={12}>
                  <label>{t("forms.login.username")}</label>
                </Grid>
              )}
              {showTypesEnv.showTarball && !isDockerEnv && (
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
                      options={envs.tarball}
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
              )}
              {showTypesEnv.showDocker && isDockerEnv && (
                <Grid item xs={12}>
                  <FormElement name="docker-image" textLabel={t("forms.create_submission.docker_image", "Docker Runtime Image")}>
                    <AutocompleteInput
                      value={state.dockerImage}
                      onChange={value => {
                        setState({
                          ...state,
                          dockerImage: value,
                        });
                      }}
                      options={envs.docker}
                      className="autocompleteValue"
                    />
                  </FormElement>
                </Grid>
              )}
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
                    placeholder={t("forms.create_submission.analysis_name_placeholder")}
                    value={state.title}
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
                    disabled={controlsList.analysisTypes?.length === 0 || !!state.type}
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
                <FormElement name="study-name" textLabel={t("forms.create_submission.study_name")}>
                  <Input
                    id="study-name"
                    name="study-name"
                    type="text"
                    size="medium"
                    placeholder={t("forms.create_submission.study_name_placeholder")}
                    value={state.study}
                    onChange={(e: any) => {
                      setState({
                        ...state,
                        study: e.target.value,
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
                    disabled={isLoading || !isValid}
                    onClick={handleSave}
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={
                      status !== Status.IN_PROGRESS ? (
                        <Icon iconName="submit" />
                      ) : (
                        <Spinner size={16} />
                      )
                    }
                  >
                    {t("common.buttons.create")}
                  </Button>
                </FormActionsContainer>
              </Grid>
            </Grid>
          </Block>
        </Grid>
      </Grid>
    );
  });
