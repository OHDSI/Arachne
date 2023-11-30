import { convertListToHashMap } from "../../../libs/utils";
import { Block, Button, FormElement, Grid, Icon, Input, Spinner, Tooltip } from "../../../libs/components";
import React, { useEffect, useState } from "react";

export const BlockSettings: React.FC<any> = (props) => {
  const [state, setState] = useState(convertListToHashMap(props.setting.fieldList, 'id'));


  useEffect(() => {
    setState(convertListToHashMap(props.setting.fieldList, 'id'))
  }, [props.setting.fieldList])

  console.log(Object.values(state))
  return (
    <Block>
      <Grid container spacing={2} item xs={12} p={2}>
        <Grid item xs={12} sm={12} container spacing={2}>
          {props.setting.fieldList.map(field => {
            if (field.type === 'text') {
              return (
                <Grid item xs={6}>
                  <FormElement name={field.name} textLabel={field.label}>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      size="medium"
                      value={state[field.id]?.value}
                      onChange={(e: any) =>
                        setState({ ...state, [field.id]: { ...state[field.id], value: e.target.value } })
                      }
                      fullWidth
                    />
                  </FormElement>
                </Grid>
              )
            }
          })}
        </Grid>
        <Grid item xs={12} mt={2} display="flex" justifyContent="flex-end">
          <Button
            disabled={props.isLoading}
            onClick={() => props.onEdit(Object.values(state).map(elem => ({ [elem.id]: elem.value })))}
            variant="contained"
            size="small"
            color="success"
            startIcon={
              !props.isLoading ? <Icon iconName="submit" /> : <Spinner size={16} />
            }
            sx={{ ml: 2 }}
          >
            {'Save'}
          </Button>
        </Grid>
      </Grid>
    </Block>
  )
}