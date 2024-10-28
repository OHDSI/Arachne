import { isEqual } from 'lodash';
import { Button, FormActionsContainer, Grid, Icon, Input } from '../../libs/components';
import React, { useEffect, useState } from 'react';
import { getUUID } from '../../libs/utils';


export const CreateOptions: React.FC<any> = props => {
  const { vars, onChange } = props;
  const [state, setState] = useState(Object.keys(vars).map(elem => ({
    id: getUUID(),
    name: vars[elem],
    value: elem
  })))

  useEffect(() => {
    if (state.length == 0) {
      setState(prevState => {
        return Object.keys(vars).map(elem => {
          return {
            id: getUUID(),
            name: vars[elem],
            value: elem
          }
        })
      })
    }
  }, [vars])

  useEffect(() => {
    const hash = {}
    state.forEach(elem => {
      hash[elem.value] = elem.name
    })
    onChange(hash)
  }, [state])

  const stateChange = (type, newValue, index, id) => {
    if (type == 'value') {
      setState(prevState => {
        const temp = [...prevState]
        const elem = temp.find(elem => elem.id == id)

        temp.splice(index, 1, {
          ...elem,
          value: newValue
        })

        return temp;
      })
    } else {
      setState(prevState => {
        const temp = [...prevState]
        const elem = temp.find(elem => elem.id == id)

        temp.splice(index, 1, {
          ...elem,
          name: newValue
        })

        return temp;
      })
    }
  }

  return (
    <Grid container spacing={1}>
      {state.map((option: any, index: any) => {

        return (
          <Grid
            key={`${index}`}
            item
            xs={12}
            container
            spacing={2}
            alignItems="center"
            classes={{
              root: 'metadata-attribute-option',
            }}
          >
            <Grid item flexGrow={1}>
              <Input
                id="key"
                name="key"
                type="text"
                size="medium"
                placeholder="Enter variable"
                value={option.value}
                onChange={(val) => {
                  stateChange('value', val.target.value, index, option.id)
                }}
                fullWidth
              />
            </Grid>
            <Grid item flexGrow={1}>
              <Input
                id="value"
                name="value"
                type="text"
                size="medium"
                placeholder="Enter value of variable"
                value={option.name}
                onChange={(val) => {
                  stateChange('name', val.target.value, index, option.id)
                }}
                fullWidth
              />
            </Grid>
            {/* <Grid item>
              <Button
                disabled={Object.keys(state).length === 1}
                onClick={() => {
                  
                }}
                size="small"
                sx={{ minWidth: 0 }}
              >
                <Icon
                  iconName="delete"
                  fontSize="small"
                  color={
                    Object.keys(state).length === 1 ? 'disabled' : 'error'
                  }
                />
              </Button>
            </Grid> */}
          </Grid>
        );
      })}
      {/* <Grid item xs={12}>
        <FormActionsContainer>
          <Button
            onClick={() => {}}
            variant="text"
            startIcon={<Icon iconName="add" />}
            sx={{ textDecoration: 'underline' }}
            className="add-option"
          >
            Add new variable
          </Button>
        </FormActionsContainer>
      </Grid> */}
    </Grid>
  );
};
