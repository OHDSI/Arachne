import { Button, Grid, Icon } from '../../../libs/components';
import { Block } from '../../../libs/components/Block';
import { FormActionsContainer } from '../../../libs/components/Content';
import { FormElement } from '../../../libs/components/FormElement';
import { Select } from '../../../libs/components/Select/Select';
import { SecondaryContentWrapper } from '../../../libs/components/wrappers';
import React, { FC, useState, memo, useCallback, useEffect } from 'react';


interface PublishDataSourceFormInterfaceProps {
  dataSourceId: string;
  onCancel: any;
  onPublish: any;
  createMethod: any;
}

export const PublishDataSourceForm: FC<PublishDataSourceFormInterfaceProps> =
  memo(props => {
    const { dataSourceId, onCancel, onPublish, createMethod } = props;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [centrals, setCentrals] = useState([]);
    const [state, setState] = useState<any>({
      centralIds: [],
    });

    const onPublishDataSource = useCallback(async () => {
      setIsLoading(true);
      try {
        const result = await createMethod(dataSourceId, {
          centralId: state.centralIds[0],
        });

        onPublish();
        setIsLoading(false);
      } catch (e) { }
    }, [state]);

    // useEffect(() => {
    //   getListCentralHosts().then(list => {
    //     setCentrals(
    //       list.content.map(item => {
    //         return {
    //           value: item.id,
    //           name: item.address,
    //         };
    //       })
    //     );
    //   });
    // }, []);

    return (
      <Grid container>
        <SecondaryContentWrapper>
          <Block>
            <Grid container spacing={2} p={2}>
              <Grid item xs={12}>
                <FormElement name="type" textLabel="Centrals" required>
                  <Select
                    className=""
                    name="type"
                    disablePortal
                    id="type"
                    options={centrals}
                    value={state.centralIds}
                    placeholder="Select central..."
                    multiple
                    onChange={(central: any) => {
                      setState({
                        ...state,
                        centralIds: central,
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
                    disabled={isLoading || state.centralIds.length == 0}
                    onClick={onPublishDataSource}
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={<Icon iconName="submit" />}
                  >
                    Publish data source
                  </Button>
                </FormActionsContainer>
              </Grid>
            </Grid>
          </Block>
        </SecondaryContentWrapper>
      </Grid>
    );
  });
