import { ImportJsonFile } from '../../../libs/components/ImportJsonFile';
import { getDbmsTypes, updateDataSource } from '../../../api/data-sources';
import { Button, Grid, Icon, Input, Tooltip } from '../../../libs/components';
import { FormElement } from '../../../libs/components/FormElement';
import { Select } from '../../../libs/components/Select/Select';
import { SecondaryContentWrapper } from '../../../libs/components/wrappers';
import { parseDbmsTypesForSelectForm } from '../../../libs/utils/parseDbmsTypesForSelectForm';
import { isEmpty } from 'lodash';
import React, { FC, useState, memo, useCallback, useEffect } from 'react';
import { DBMSType } from '../../../libs/enums';
import { BaseResponceInterface, DBMSTypesInterface, DataSourceDTOInterface, SelectInterface } from '../../../libs/types';
import { useNotifications } from '../../../libs/components/Notification';
import { Spinner } from '../../../libs/components/Spinner';
import { ContentBlock } from '../../../libs/components/Block';

interface CreateCdmDataSourceFormPropsInterface {
  afterCreate: () => void;
  onCancel: () => void;
  value?: DataSourceDTOInterface;
  createMethod: (data: FormData, id?: string) => Promise<BaseResponceInterface<DataSourceDTOInterface>>,
  isUpdate?: boolean;
}

export const CreateDatabaseForm: FC<CreateCdmDataSourceFormPropsInterface> =
  memo(props => {
    const {
      afterCreate,
      onCancel,
      createMethod,
      value,
      isUpdate,
    } = props;
    const { enqueueSnackbar } = useNotifications();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dbsmTypes, setDbsmTypes] = useState<SelectInterface<DBMSType>[]>([]);
    const [originFile, setOriginFile] = useState();

    const [state, setState] = useState<DataSourceDTOInterface>(
      value || {
        uuid: null,
        name: '',
        description: '',
        dbmsType: DBMSType.POSTGRESQL,
        connectionString: '',
        cdmSchema: '',
        resultSchema: '',
        targetSchema: '',
        published: false,
        dbUsername: '',
        dbPassword: '',
        krbAuthMechanism: 'PASSWORD',
        useKerberos: false,
        cohortTargetTable: '',
        modelType: "CDM",
        healthStatus: "NOT_COLLECTED",
        healthStatusDescription: null,
        krbFQDN: null,
        krbRealm: null,
        krbUser: null,
        krbPassword: '',
        hasKeytab: false
      }
    );

    useEffect(() => {
      getDbmsTypes().then((res: DBMSTypesInterface[]) => {
        setDbsmTypes(parseDbmsTypesForSelectForm(res));
      });
    }, []);

    const handleSave = useCallback(async () => {
      setIsLoading(true);
      try {
        let fd = new FormData();
        fd.append(
          'dataSource',
          new Blob([JSON.stringify(state)], {
            type: 'application/json',
          })
        );
        fd.append('keyfile', originFile);

        const res: BaseResponceInterface<DataSourceDTOInterface> =
          isUpdate ? await updateDataSource(fd, value.id) : await createMethod(fd);

        setIsLoading(false);
        console.log(res)
        if (res.errorCode == 4) throw new Error();
        enqueueSnackbar({
          message: `${isUpdate ? 'Updated' : 'Created'} data source`,
          variant: 'success',
        } as any);
        afterCreate?.();
      } catch (e) {
        enqueueSnackbar({
          message: 'OOps!!! Something wrong',
          variant: 'error',
        } as any);
      }
    }, [state, createMethod, originFile]);

    const NOT_VALID =
      isEmpty(state.name) ||
      isEmpty(state.dbmsType) ||
      isEmpty(state.connectionString) ||
      isEmpty(state.cdmSchema) ||
      isEmpty(state.resultSchema) ||
      (state.dbmsType === DBMSType.BIGQUERY
        ? !originFile
        : isEmpty(state.dbUsername) ||
        isEmpty(state.dbPassword));

    return (
      <Grid container>
        <SecondaryContentWrapper>
          <Grid item xs={12}>
            <ContentBlock title="General" collapsible>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormElement name="name" textLabel="Name" required>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      size="medium"
                      value={state.name}
                      onChange={(e: any) =>
                        setState({ ...state, name: e.target.value })
                      }
                      fullWidth
                    />
                  </FormElement>
                </Grid>
                <Grid item xs={12}>
                  <FormElement
                    name="description"
                    textLabel="Description"
                  >
                    <Input
                      id="description"
                      name="description"
                      type="text"
                      size="medium"
                      value={state.description}
                      onChange={(e: any) =>
                        setState({ ...state, description: e.target.value })
                      }
                      fullWidth
                    />
                  </FormElement>
                </Grid>
                <Grid item xs={12}>
                  <FormElement name="type" textLabel="Database type" required>
                    <Select
                      className=""
                      name="type"
                      disablePortal
                      id="type"
                      options={dbsmTypes}
                      value={state.dbmsType}
                      placeholder="Select type..."
                      onChange={(dbmsType: DBMSType) => {
                        setState({ ...state, dbmsType });
                      }}
                      fullWidth
                    />
                  </FormElement>
                </Grid>
                <Grid item xs={12}>
                  <FormElement
                    name="connectionString"
                    textLabel="Connection string"
                    required
                  >
                    <Input
                      id="connectionString"
                      name="connectionString"
                      type="text"
                      size="medium"
                      value={state.connectionString}
                      onChange={(e: any) =>
                        setState({ ...state, connectionString: e.target.value })
                      }
                      fullWidth
                    />
                  </FormElement>
                </Grid>
                {state.dbmsType === DBMSType.BIGQUERY ? (
                  <Grid item xs={12}>
                    <ImportJsonFile
                      titleButton={'Upload keyfile'}
                      initialTextFile={value?.description} onChange={(parsedJson: any, file: any) => {
                        setOriginFile(file);
                      }} />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <FormElement name="username" textLabel="Username" required>
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          size="medium"
                          value={state?.dbUsername}
                          onChange={(e: any) =>
                            setState({
                              ...state,
                              dbUsername: e.target.value
                            })
                          }
                          fullWidth
                        />
                      </FormElement>
                    </Grid>
                    <Grid item xs={12}>
                      <FormElement name="password" textLabel="Password" required>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          size="medium"
                          value={state?.dbPassword}
                          onChange={(e: any) =>
                            setState({
                              ...state,
                              dbPassword: e.target.value

                            })
                          }
                          fullWidth
                        />
                      </FormElement>
                    </Grid>
                  </>
                )}
              </Grid>
            </ContentBlock>
          </Grid>
          <Grid item xs={12} mt={2}>
            <ContentBlock title="CDM settings" collapsible>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormElement name="cdmSchema" textLabel="CDM schema" required>
                    <Input
                      id="cdmSchema"
                      name="cdmSchema"
                      type="text"
                      size="medium"
                      value={state.cdmSchema}
                      onChange={(e: any) =>
                        setState({ ...state, cdmSchema: e.target.value })
                      }
                      fullWidth
                    />
                  </FormElement>
                </Grid>
                <Grid item xs={12}>
                  <FormElement name="schema" textLabel="Target schema" required>
                    <Input
                      id="schema"
                      name="schema"
                      type="text"
                      size="medium"
                      value={state.targetSchema}
                      onChange={(e: any) =>
                        setState({ ...state, targetSchema: e.target.value })
                      }
                      fullWidth
                    />
                  </FormElement>
                </Grid>
                <Grid item xs={12}>
                  <FormElement
                    name="resultSchema"
                    textLabel="Results schema"
                    required
                  >
                    <Input
                      id="resultSchema"
                      name="resultSchema"
                      type="text"
                      size="medium"
                      value={state.resultSchema}
                      onChange={(e: any) =>
                        setState({ ...state, resultSchema: e.target.value })
                      }
                      fullWidth
                    />
                  </FormElement>
                </Grid>
              </Grid>
            </ContentBlock>
          </Grid>
          <Grid item xs={12} mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              disabled={isLoading}
              onClick={onCancel}
              size="small"
              startIcon={<Icon iconName="deactivate" />}
            >
              Cancel
            </Button>
            <Tooltip
              text={NOT_VALID ? 'Please, fill out required fields' : undefined}
            >
              <div>
                <Button
                  disabled={isLoading || NOT_VALID}
                  onClick={handleSave}
                  variant="contained"
                  size="small"
                  color="success"
                  startIcon={
                    !isLoading ? <Icon iconName="submit" /> : <Spinner size={16} />
                  }
                  sx={{ ml: 2 }}
                >
                  {isUpdate ? 'Update' : 'Create'}
                </Button>
              </div>
            </Tooltip>
          </Grid>
        </SecondaryContentWrapper>
      </Grid>
    );
  });