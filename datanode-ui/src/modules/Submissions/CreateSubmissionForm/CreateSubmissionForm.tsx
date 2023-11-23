import React, {
  FC,
  useState,
  memo,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

import { tabs } from './CreateSubmissionForm.config';

import { SpinnerFormContainer } from './ChooseRuntime.styles';
import { CreateSubmissionFormTabs, Status, AnalysisTypes } from '../../../libs/enums';

import {
  Button,
  Grid,
  Icon, Input, Spinner,
  FormElement, Select, FormActionsContainer,
  TabsNavigationNew, ImportJsonFile, ImportZipFile, Block, useNotifications
} from '../../../libs/components';
import { Paper } from '@mui/material';
import { analysisTypes } from '../../../libs/constants';
import { getAnalysisTypes, getDescriptors } from '../../../api/submissions';
import { getDataSources } from '../../../api/data-sources';
import { BaseResponceInterface, DataSourceDTOInterface, DescriptorInterface, IdNameInterface, SelectInterface } from '@/libs/types';
import { parseToSelectControlOptions } from '../../../libs/utils';

const defaultState = (type = null) => {
  return {
    title: null,
    executableFileName: null,
    study: null,
    environmentId: null,
    datasourceId: null,
    type: type
  }
};

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
  createMethod: (data: any) => Promise<any>;
}

interface ControlListInterfaceState {
  status: Status;
  envs: SelectInterface<number>[];
  analysisTypes: SelectInterface<AnalysisTypes>[];
  dataSources: SelectInterface<number>[];
  entryFiles: SelectInterface<string>[];
}

export const CreateSubmissionForm: FC<CreateSubmissionFormInterfaceProps> =
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

    const handleSave = useCallback(async () => {
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

        const result = await createMethod(fd);
        setStatus(Status.SUCCESS);
        enqueueSnackbar({
          message: `Successfully created submission`,
          variant: 'success',
        } as any);
        setIsLoading(false);
        afterCreate?.(result);
      } catch (e) {
        enqueueSnackbar({
          message: `Something went wrong`,
          variant: 'error',
        } as any);
      }
    }, [state, createMethod]);

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
      console.log(Object.values(zipFolder.files))
      return Object.keys(zipFolder.files)
        .map(fileId => zipFolder.files[fileId])
        .filter(file => {
          return (
            file.name.toLowerCase().includes('.sql') ||
            file.name.toLowerCase().includes('.r')
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
          <TabsNavigationNew tabs={tabs(setActiveTab)} active={activeTab} />
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
                      const analysisName = getAnalysisName(zip);

                      setControlsList(prevState => ({
                        ...prevState,
                        entryFiles: unpackZip(zipFolder)
                      }))

                      setState({
                        ...state,
                        title: analysisName.join(),
                      });

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
                    const analysisName = getAnalysisName(file);

                    setState({
                      ...state,
                      title: analysisName.join(),
                      executableFileName: file.name
                    });

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
