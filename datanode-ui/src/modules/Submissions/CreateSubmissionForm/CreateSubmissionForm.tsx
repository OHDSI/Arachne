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
import { CreateSubmissionFormTabs } from '../../../libs/enums/CreateSubmissionFormTabs';
import { Status } from '../../../libs/enums';
import { AnalysisTypes } from '../../../libs/enums/AnalysisTypes';
import { Button, Grid, Icon, Input } from '../../../libs/components';
import { Paper } from '@mui/material';
import { Spinner } from '../../../libs/components/Spinner';
import { FormElement } from '../../../libs/components/FormElement';
import { Select } from '../../../libs/components/Select/Select';
import { analysisTypes } from '../../../libs/constants';
import { FormActionsContainer } from '../../../libs/components/Content';
import { TabsNavigationNew } from '../../../libs/components/TabsNavigation';
import { ImportJsonFile } from '../../../libs/components/ImportJsonFile';
import { ImportZipFile } from '../../../libs/components/ImportZipFile';
import { getAnalysisTypes, getDescriptors } from '../../../api/submissions';
import { Block } from '../../../libs/components/Block';
import { getDataSources } from '../../../api';

export enum DBMSType {
  POSTGRESQL = 'POSTGRESQL',
  MS_SQL_SERVER = 'MS_SQL_SERVER',
  PDW = 'PDW',
  REDSHIFT = 'REDSHIFT',
  ORACLE = 'ORACLE',
  IMPALA = 'IMPALA',
  BIGQUERY = 'BIGQUERY',
  NETEZZA = 'NETEZZA',
  HIVE = 'HIVE',
}

export const dbsmTypes = [
  {
    name: 'PostgreSQL',
    value: DBMSType.POSTGRESQL,
  },
  {
    name: 'MS SQL Server',
    value: DBMSType.MS_SQL_SERVER,
  },
  {
    name: 'SQL Server Parallel Data Warehouse',
    value: DBMSType.PDW,
  },
  {
    name: 'Redshift',
    value: DBMSType.REDSHIFT,
  },
  {
    name: 'Oracle',
    value: DBMSType.ORACLE,
  },
  {
    name: 'Impala',
    value: DBMSType.IMPALA,
  },
  {
    name: 'Google BigQuery',
    value: DBMSType.BIGQUERY,
  },
  {
    name: 'Netezza',
    value: DBMSType.NETEZZA,
  },
  {
    name: 'Apache Hive',
    value: DBMSType.HIVE,
  },
];

const defaultState = {
  dataSourceId: null,
  title: null,
  analysisType: null,
  analysisTitle: null,
  studyId: null,
  studyName: null,
  executableFileName: null,
  runtimeEnvironmentId: null,
  fileIds: null,
};

interface CreateSubmissionFormInterfaceProps {

  afterCreate: (analysis: any) => void;
  onCancel: () => void;
  createMethod: (data: any) => Promise<any>;
  subModules?: any;
}

export const CreateSubmissionForm: FC<CreateSubmissionFormInterfaceProps> =
  memo(props => {
    const { afterCreate, onCancel, createMethod } = props;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [controlsList, setControlsList] = useState({
      status: Status.INITIAL,
      envs: [],
      analysisTypes: [],
      dataSources: []
    })
    const [filesEntryPoint, setFilesEntryPoint] = useState([]);
    const [status, setStatus] = useState(Status.INITIAL);
    const [env, setEnv] = useState([]);
    const [fileState, setFileState] = useState();
    const [state, setState] = useState<any>(defaultState);
    const [activeTab, setActiveTab] = useState<any>(
      CreateSubmissionFormTabs.FILES_IN_ARCHIVE
    );

    useEffect(() => {
      getControlsList();
    }, []);

    useEffect(() => {
      setState(defaultState);
    }, [activeTab]);

    const getControlsList = async () => {
      try {
        const envs: any = await getDescriptors();
        const types: any = await getAnalysisTypes();
        const dataSources: any = await getDataSources();

        setControlsList({
          status: Status.SUCCESS,
          envs: envs.map(elem => {
            return {
              name: elem.label,
              value: elem.id,
            };
          }),
          analysisTypes: types.map(elem => {
            return {
              name: elem.name,
              value: elem.id,
            };
          }),
          dataSources: dataSources.result.map(elem => {
            return {
              name: elem.name,
              value: elem.id,
            };
          })
        })

      } catch (e) {

      }
    }

    const handleSave = useCallback(() => {
      setIsLoading(true);
      createMethod(state).then((response: any) => {
        setIsLoading(false);
        afterCreate?.(response);
      });
    }, [state, createMethod]);

    const isValid = useMemo(() => {
      if (activeTab === CreateSubmissionFormTabs.FILES_IN_ARCHIVE) {
        return (
          state.fileIds &&
          state.dataSourceId &&
          state.analysisType &&
          state.executableFileName
        );
      }
      if (activeTab === CreateSubmissionFormTabs.SEPARATE_FILES) {
        return state.fileIds && state.dataSourceId && state.analysisType;
      }
    }, [state, activeTab]);

    const handleCheckMetadata = useCallback(
      async (file, name?) => {
        console.log(file, name);
        setStatus(Status.IN_PROGRESS);
        let fd = new FormData();
        fd.append('file', file);
        try {
          // const result = await tempUploadFiles(fd);
          if (activeTab === CreateSubmissionFormTabs.FILES_IN_ARCHIVE) {
            try {
              // const metadata: any = await getMetadataFile(result[0]);
              // setState({
              //   ...state,
              //   analysisType: metadata?.analysisType,
              //   analysisTitle: metadata?.analysisName,
              //   studyName: metadata?.studyName,
              //   executableFileName: metadata?.entryPoint,
              //   runtimeEnvironmentId:
              //     metadata?.runtimeEnvironmentId || env?.[0]?.value,
              //   fileIds: result,
              // });
              setStatus(Status.SUCCESS);
            } catch (e) {
              // setState({
              //   ...state,
              //   runtimeEnvironmentId:
              //     state.runtimeEnvironmentId || controlsList.envs?.[0]?.value,
              //   fileIds: result,
              //   analysisTitle: name,
              // });
              setStatus(Status.SUCCESS);
            }
          } else {
            // setState({
            //   ...state,
            //   runtimeEnvironmentId:
            //     state.runtimeEnvironmentId || controlsList.envs?.[0]?.value,
            //   fileIds: result,
            //   analysisType: AnalysisTypes.STRATEGUS,
            // });
            setStatus(Status.SUCCESS);
          }
        } catch (e) {
          setStatus(Status.ERROR);
          console.log(e);
        }
      },
      [activeTab, state, env]
    );

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
                      const simple_files = Object.keys(zipFolder.files)
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
                      setFilesEntryPoint(simple_files);
                      const analysisName = zip.name.split('.');
                      analysisName.pop();
                      setState({
                        ...state,
                        analysisTitle: analysisName.join(),
                      });
                      setFileState(zip);
                      handleCheckMetadata(zip, analysisName.join());
                    }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormElement name="type" textLabel="Entry point" required>
                      <Select
                        className=""
                        name="entry-point"
                        disablePortal
                        id="entry point"
                        options={filesEntryPoint}
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
                        options={controlsList.envs}
                        value={state.runtimeEnvironmentId}
                        placeholder="Select env..."
                        onChange={(env: any) => {
                          setState({
                            ...state,
                            runtimeEnvironmentId: env,
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
                        options={controlsList.dataSources}
                        value={state.dataSourceId}
                        placeholder="Select source..."
                        onChange={(dataSourceId: any) => {
                          setState({
                            ...state,
                            dataSourceId: dataSourceId,
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
                        value={state.analysisTitle}
                        onChange={(e: any) => {
                          setState({
                            ...state,
                            analysisTitle: e.target.value,
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
                        options={analysisTypes}
                        value={state.analysisType}
                        placeholder="Select analysis type..."
                        onChange={(type: any) => {
                          setState({
                            ...state,
                            analysisType: type,
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
                        value={state.studyName}
                        onChange={(e: any) => { }}
                        fullWidth
                      />
                    </FormElement>
                  </Grid>
                </>
              )}
              {activeTab === CreateSubmissionFormTabs.SEPARATE_FILES && (
                <>
                  <Grid item xs={12}>
                    <ImportJsonFile titleButton={'Upload json'} onChange={(parsedJson: any, file: any) => {
                      handleCheckMetadata(file);
                    }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormElement
                      name="env"
                      textLabel="ARACHNE Runtime Environment"
                      required
                    >
                      {/* <ChooseRuntime /> */}
                      <Select
                        className=""
                        name="env"
                        disablePortal
                        id="env"
                        options={env}
                        value={state.runtimeEnvironmentId}
                        placeholder="Select env..."
                        onChange={(env: any) => {
                          setState({
                            ...state,
                            runtimeEnvironmentId: env,
                          });
                        }}
                        fullWidth
                      />
                    </FormElement>
                  </Grid>
                  <Grid item xs={12}>
                    {/* <subModules.dataSources
                      type="component"
                      name="data-sources-list-select"
                      subModules={subModules}
                      config={{
                        onChange: (id: string) => {
                          setState({
                            ...state,
                            dataSourceId: id,
                          });
                        },
                      }}
                    /> */}
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
                        value={state.analysisTitle}
                        onChange={(e: any) => {
                          setState({
                            ...state,
                            analysisTitle: e.target.value,
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
                        disabled
                        options={analysisTypes}
                        value={AnalysisTypes.STRATEGUS}
                        placeholder=""
                        onChange={(type: any) => {
                          setState({
                            ...state,
                            analysisType: type,
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
                        value={state.studyName}
                        onChange={(e: any) => { }}
                        fullWidth
                      />
                    </FormElement>
                  </Grid>
                </>
              )}
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
                      !isLoading ? (
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
