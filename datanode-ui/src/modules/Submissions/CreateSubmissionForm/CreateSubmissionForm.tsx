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
  TabsNavigationNew, ImportJsonFile, ImportZipFile, Block
} from '../../../libs/components';
import { Paper } from '@mui/material';
import { analysisTypes } from '../../../libs/constants';
import { getAnalysisTypes, getDescriptors } from '../../../api/submissions';
import { getDataSources } from '../../../api/data-sources';

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
  title: null,
  executableFileName: null,
  study: null,
  environmentId: null,
  datasourceId: null,
  type: null
};

interface SubmissionFormStateInterface {
  executableFileName: string;
  study: string;
  type: AnalysisTypes;
  environmentId: string;
  datasourceId: string;
  title: string;
}

/*
    {"executableFileName":"runAnalysis.R",
    "datasourceId":"47","title":"[HIV_TP] Combination Medications",
    "study":"LEGEND and the others",
    "type":"COHORT_CHARACTERIZATION",
    "environmentId":"5"}
    */

interface CreateSubmissionFormInterfaceProps {
  afterCreate: (analysis: any) => void;
  onCancel: () => void;
  createMethod: (data: any) => Promise<any>;
}

export const CreateSubmissionForm: FC<CreateSubmissionFormInterfaceProps> =
  memo(props => {
    const { afterCreate, onCancel, createMethod } = props;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [controlsList, setControlsList] = useState({
      status: Status.INITIAL,
      envs: [],
      analysisTypes: [],
      dataSources: [],
      entryFiles: [],
    })
    const [filesEntryPoint, setFilesEntryPoint] = useState([]);
    const [status, setStatus] = useState(Status.INITIAL);
    const [env, setEnv] = useState([]);
    const [fileState, setFileState] = useState();
    const [state, setState] = useState<SubmissionFormStateInterface>(defaultState);
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

        setControlsList(prevState => ({
          ...prevState,
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
        }))

      } catch (e) {

      }
    }

    const handleSave = useCallback(() => {
      setIsLoading(true);
      const fd = new FormData();

      fd.append('file', fileState);
      fd.append('analysis', state as any);

      createMethod(fd).then((response: any) => {
        setIsLoading(false);
        afterCreate?.(response);
      });
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
        return state.datasourceId && state.environmentId && state.type;
      }
    }, [state, activeTab]);

    const unpackZip = (zipFolder) => {
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
                    setFileState(file);
                    // handleCheckMetadata(file);
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
                    options={analysisTypes}
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
                        type: e.target.value,
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
