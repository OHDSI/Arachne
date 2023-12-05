import React, { memo, useEffect, useMemo, useState, } from 'react';

import { SpinnerFormContainer } from './ChooseRuntime.styles';
import { AnalysisTypes, CreateSubmissionFormTabs, Status } from '../../../libs/enums';

import {
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
} from '../../../libs/components';
import { Paper } from '@mui/material';
import { getAnalysisTypes, getDescriptors } from '../../../api/submissions';
import { getDataSources } from '../../../api/data-sources';
import { DataSourceDTOInterface, DescriptorInterface, IdNameInterface, SelectInterface } from '../../../libs/types';
import { parseToSelectControlOptions } from '../../../libs/utils';
import { tabsSubmissionForm } from '../../../config';

const defaultState = (type = null): SubmissionFormStateInterface => ({
  title: null,
  executableFileName: null,
  study: null,
  environmentId: null,
  datasourceId: null,
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
}

interface ControlListInterfaceState {
  status: Status;
  envs: SelectInterface<number>[];
  analysisTypes: SelectInterface<AnalysisTypes>[];
  dataSources: SelectInterface<number>[];
  entryFiles: SelectInterface<string>[];
}

export const CreateSubmissionForm: React.FC<CreateSubmissionFormInterfaceProps> =
  memo(props => {
    const { afterCreate, onCancel, createMethod } = props;
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

    const [status, setStatus] = useState(Status.INITIAL);
    const [fileState, setFileState] = useState<any>();
    const [activeTab, setActiveTab] = useState<CreateSubmissionFormTabs>(
      CreateSubmissionFormTabs.FILES_IN_ARCHIVE
    );

    const tabs = React.useMemo(() => tabsSubmissionForm(setActiveTab), [setActiveTab]);

    useEffect(() => {
      setControlsList(prevState => ({ ...prevState, status: Status.IN_PROGRESS }))
      getControlsList();
    }, []);

    useEffect(() => {
      setState(defaultState(activeTab === CreateSubmissionFormTabs.SEPARATE_FILES ? AnalysisTypes.STRATEGUS : null));
    }, [activeTab]);

    const getControlsList = async () => {
      try {
        const envs: DescriptorInterface[] = await getDescriptors();
        const types: IdNameInterface<AnalysisTypes>[] = await getAnalysisTypes();
        const dataSources: DataSourceDTOInterface[] = await getDataSources();

        setControlsList(prevState => ({
          ...prevState,
          status: Status.SUCCESS,
          envs: parseToSelectControlOptions(envs, 'label'),
          analysisTypes: parseToSelectControlOptions(types),
          dataSources: parseToSelectControlOptions(dataSources)
        }))

      } catch (e) {
        setControlsList(prevState => ({ ...prevState, status: Status.ERROR }))
      }
    }

    const handleSave = async () => {
      setIsLoading(true);
      setStatus(Status.IN_PROGRESS)
      try {
        const fd = new FormData();

        fd.append('file', fileState);

        const str = JSON.stringify({
          ...state,
          environmentId: `${state.environmentId}`,
          datasourceId: `${state.datasourceId}`,
        });
        const bytes = new TextEncoder().encode(str);
        const blob = new Blob([bytes], {
          type: "application/json"
        });
        fd.append('analysis', blob);

        const result = await createMethod(activeTab, fd);
        setStatus(Status.SUCCESS);
        enqueueSnackbar({
          message: `Submission successfully created`,
          variant: 'success',
        } as any);
        setIsLoading(false);
        afterCreate?.(result);
      } catch (e) {
        enqueueSnackbar({
          message: `Submission was not created, please try again`,
          variant: 'error',
        } as any);
      }
    }

    const isValid = useMemo(() => {
      if (activeTab === CreateSubmissionFormTabs.FILES_IN_ARCHIVE) {
        return (
          state.datasourceId &&
          state.type &&
          state.environmentId &&
          state.executableFileName
        );
      }
      if (activeTab === CreateSubmissionFormTabs.SEPARATE_FILES) {
        return state.datasourceId && state.environmentId && state.type && state.executableFileName;
      }
    }, [state, activeTab]);

    const unpackZip = (zipFolder) => {
      return Object.keys(zipFolder.files)
        .map(fileId => zipFolder.files[fileId])
        .filter(file => {
          return (
            file.name.toLowerCase().includes('.sql', -5) ||
            file.name.toLowerCase().includes('.r', -5)
          );
        })
        .map(file => {
          return {
            name: file.name,
            value: file.name,
          };
        });
    };

    const getAnalysisName = (zip: any) => {
      const analysisName = zip.name.split('.');
      analysisName.pop();

      return analysisName;
    }

    return (
      <Grid container>
        <Paper elevation={3} sx={{ zIndex: 2, px: 2, width: '100%' }}>
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
                    <ImportZipFile titleButton='Upload zip' onChange={(zipFolder: any, zip: any) => {

                      if (zip) {
                        const analysisName = getAnalysisName(zip);

                        setControlsList(prevState => ({
                          ...prevState,
                          entryFiles: unpackZip(zipFolder)
                        }))

                        setState({
                          ...state,
                          title: analysisName.join(),
                        });
                      } else {
                        setControlsList(prevState => ({
                          ...prevState,
                          entryFiles: []
                        }))

                        setState({
                          ...state,
                          title: null,
                        });
                      }

                      setFileState(zip);
                    }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormElement name="type" textLabel="Entry point" required>
                      <Select
                        className=""
                        name="entry-point"
                        disablePortal
                        id="entry point"
                        disabled={controlsList?.entryFiles?.length === 0}
                        options={controlsList.entryFiles}
                        value={state.executableFileName}
                        placeholder="Select entry point..."
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
                  <ImportJsonFile titleButton={'Upload json'} onChange={(parsedJson: any, file: any) => {
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
              <Grid item xs={12}>
                <FormElement
                  name="env"
                  textLabel="ARACHNE Runtime Environment"
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
                    placeholder="Select env..."
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
                  textLabel="Data source"
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
                    placeholder="Select source..."
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
                  textLabel="Analysis name"
                  required
                >
                  <Input
                    id="analysis-name"
                    name="analysis-name"
                    type="text"
                    size="medium"
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
                <FormElement name="type" textLabel="Analysis type" required>
                  <Select
                    className=""
                    name="type"
                    disablePortal
                    id="type"
                    disabled={controlsList.analysisTypes?.length === 0 || activeTab === CreateSubmissionFormTabs.SEPARATE_FILES}
                    options={controlsList.analysisTypes}
                    value={state.type}
                    placeholder="Select analysis type..."
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
                <FormElement name="study-name" textLabel="Study name">
                  <Input
                    id="study-name"
                    name="study-name"
                    type="text"
                    size="medium"
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
                    Cancel
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
                    Create
                  </Button>
                </FormActionsContainer>
              </Grid>
            </Grid>
          </Block>
        </Grid>
      </Grid>
    );
  });
