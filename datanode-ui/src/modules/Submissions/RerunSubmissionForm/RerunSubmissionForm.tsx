import React, { memo, useEffect, useMemo, useState, } from 'react';


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
import { getAnalysisTypes, getDescriptors, getSubmission, updateSubmission } from '../../../api/submissions';
import { getDataSources, removeDataSource, updateDataSource } from '../../../api/data-sources';
import { DataSourceDTOInterface, DescriptorInterface, IdNameInterface, SelectInterface, SubmissionDTOInterface } from '../../../libs/types';
import { parseToSelectControlOptions } from '../../../libs/utils';
import { tabsSubmissionForm } from '../../../config';
import { useEntity } from '../../../libs/hooks';
import { SpinnerFormContainer } from '../CreateSubmissionForm/ChooseRuntime.styles';

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

export const RerunSubmissionForm: React.FC<CreateSubmissionFormInterfaceProps> =
  memo(props => {
    const { afterCreate, onCancel, createMethod, isRerun, id } = props;
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

    const [fileState, setFileState] = useState<any>();
    const [activeTab, setActiveTab] = useState<CreateSubmissionFormTabs>(
      CreateSubmissionFormTabs.FILES_IN_ARCHIVE
    );

    const tabs = React.useMemo(() => tabsSubmissionForm(setActiveTab), [setActiveTab]);

    const { entity, status, updateEntity, deleteEntity, error } = useEntity<any>(
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
    }, [status])

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
      try {
        const result = await updateSubmission(id, state);
        enqueueSnackbar({
          message: `Submission successfully reruned`,
          variant: 'success',
        } as any);
        setIsLoading(false);
        afterCreate?.(result);
      } catch (e) {
        enqueueSnackbar({
          message: `Submission was not reruned, please try again`,
          variant: 'error',
        } as any);
      }
    }

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
              <FormElement name="type" textLabel="Entry point" required>
                <Input
                  id="entry"
                  name="entry"
                  type="text"
                  size="medium"
                  disabled={true}
                  value={state.executableFileName}
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
              <FormElement name="type" textLabel="Analysis type" required>
                <Select
                  className=""
                  name="type"
                  disablePortal
                  id="type"
                  disabled={true}
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
            {/* <Grid item xs={12}>
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
            </Grid> */}
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
                  Rerun
                </Button>
              </FormActionsContainer>
            </Grid>
          </Grid>
        </Block>
      </Grid>
    );
  });
