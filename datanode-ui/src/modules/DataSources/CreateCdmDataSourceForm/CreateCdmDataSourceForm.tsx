import { getDbmsTypes, updateDataSource } from '../../../api/data-sources';
import { Button, Grid, Icon, Input } from '../../../libs/components';
import { FormActionsContainer } from '../../../libs/components/Content';
import { Block } from '../../../libs/components/FilterPanel/FilterPanel.styles';
import { FormElement } from '../../../libs/components/FormElement';
import { Select } from '../../../libs/components/Select/Select';
import { SecondaryContentWrapper } from '../../../libs/components/wrappers';
import { parseDbmsTypesForSelectForm } from '../../../libs/utils/parseDbmsTypesForSelectForm';
import { isEmpty } from 'lodash';
import React, { FC, useState, memo, useCallback, useEffect } from 'react';

export const CreateCdmDataSourceForm: FC<any> =
  memo(props => {
    const {
      afterCreate,
      onCancel,
      createMethod,
      values,
      isUpdate,
      subModules,
    } = props;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dbsmTypes, setDbsmTypes] = useState([]);
    const [originFile, setOriginFile] = useState();
    const [dbsmTypesDetails, setDbsmTypesDetails] = useState<any>();
    const [state, setState] = useState<any>(
      values || {
        name: '',
        description: '',
        type: '',
        connectionString: '',
        cdmSchema: '',
        resultSchema: '',
        targetSchema: '',
        published: false,
        credentials: {
          username: '',
          password: '',
        },
      }
    );

    useEffect(() => {
      getDbmsTypes().then((res: any) => {
        setDbsmTypes(parseDbmsTypesForSelectForm(res));
        setDbsmTypesDetails(res);
      });
    }, []);

    const handleSave = useCallback(() => {
      setIsLoading(true);
      let fd = new FormData();
      fd.append(
        'datasource',
        new Blob([JSON.stringify(state)], {
          type: 'application/json',
        })
      );
      fd.append('keyfile', originFile);

      if (isUpdate) {
        updateDataSource(values.id, fd).then(
          (response: any) => {
            setIsLoading(false);
            afterCreate?.(response);
          }
        );
      } else {
        createMethod(fd).then((response: any) => {
          setIsLoading(false);
          afterCreate?.(response);
        });
      }
    }, [state, createMethod, originFile]);

    return (
      <Grid container>
        <SecondaryContentWrapper>
          <Block>
            <Grid container spacing={2} p={2}>
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
                  required
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
                    value={state.type}
                    placeholder="Select type..."
                    onChange={(type: any) => {
                      setState({ ...state, type });
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
              <Grid item xs={12}>
                <FormElement name="cdmSchema" textLabel="CDM schema">
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
              {/* {state.type === 'bigquery' && (
                <Grid item xs={12}>
                  <subModules.documents
                    type="component"
                    name="import-json-file"
                    subModules={subModules}
                    config={{
                      titleButton: 'Upload keyfile',
                      initialTextFile: values?.keyfileName,
                      onChange: (parsedJson: any, file: any) => {
                        setOriginFile(file);
                      },
                    }}
                  />
                </Grid>
              )} */}
              <Grid item xs={12}>
                <FormElement name="username" textLabel="Username" required>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    size="medium"
                    value={state?.credentials?.username}
                    onChange={(e: any) =>
                      setState({
                        ...state,
                        credentials: {
                          ...state?.credentials,
                          username: e.target.value,
                        },
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
                    value={state?.credentials?.password}
                    onChange={(e: any) =>
                      setState({
                        ...state,
                        ...state,
                        credentials: {
                          ...state.credentials,
                          password: e.target.value,
                        },
                      })
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
                    disabled={
                      isLoading || isEmpty(state.name) || isEmpty(state.type)
                    }
                    onClick={handleSave}
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={<Icon iconName="submit" />}
                  >
                    Save
                  </Button>
                </FormActionsContainer>
              </Grid>
            </Grid>
          </Block>
        </SecondaryContentWrapper>
      </Grid>
    );
  });
