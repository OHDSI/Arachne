import { AutocompleteInput } from '../../../../libs/components/Autocomplete/AutocompleteInput';
import { Block, Button, FormActionsContainer, FormElement, Grid, Icon, SecondaryContentWrapper } from '../../../../libs/components';
import { Autocomplete } from '../../../../libs/components/Autocomplete/Autocomplete';
import React, { FC, useState, memo, useCallback, useEffect } from 'react';
import { addUser, searchUsers } from '../../../../api/admin';
import { BaseResponceInterface } from '../../../../libs/types';
import { parseToSelectControlOptions } from '../../../../libs/utils';


export const AddUserForm: FC<any> =
  memo(props => {
    const { onCancel, afterCreate } = props;
    const [user, setUser] = useState<any>(null);
    const [users, setUsers] = useState([]);
    const [searchUser, serUserSearch] = useState('');

    const search = async (value) => {
      const result: BaseResponceInterface<any> = await searchUsers(value);
      setUsers(parseToSelectControlOptions(
        result.result.map(user => ({ ...user, fullname: `${user.firstname} ${user.lastname}` })),
        'fullname',
        'username'
      ))
    }

    const onAddUser = useCallback(async () => {
      try {
        const result = await addUser(user.value);
        afterCreate?.();
      } catch (e) {
        console.log(e);
      }
    }, [user]);

    useEffect(() => {
      search(searchUser)
    }, [searchUser]);

    return (
      <Grid container>
        <SecondaryContentWrapper>
          <Block>
            <Grid container spacing={2} p={2}>
              <Grid item xs={12}>
                <FormElement name="type" textLabel="Users" required>
                  <AutocompleteInput
                    value={user?.name}
                    onChange={(val: any) => {
                      const userValue = users.find(elem => elem.name === val);

                      setUser(userValue);
                    }}
                    onInputChange={(value) => {
                      serUserSearch(value)
                    }}
                    options={users}
                  />
                </FormElement>
              </Grid>
              <Grid item xs={12}>
                <FormActionsContainer>
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    size="small"
                    startIcon={<Icon iconName="deactivate" />}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onAddUser}
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={<Icon iconName="submit" />}
                  >
                    Add
                  </Button>
                </FormActionsContainer>
              </Grid>
            </Grid>
          </Block>
        </SecondaryContentWrapper>
      </Grid>
    );
  });
