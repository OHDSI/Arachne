import { convertListToHashMap } from "../../../libs/utils";
import { Block, Button, FormElement, Grid, Icon, Input, Spinner } from "../../../libs/components";
import React, { useEffect, useState } from "react";
import { Checkbox } from "../../../libs/components/Checkbox/Checkbox";

export const BlockSettings: React.FC<any> = (props) => {
  const [state, setState] = useState(convertListToHashMap(props.setting.fieldList, 'id'));


  useEffect(() => {
    setState(convertListToHashMap(props.setting.fieldList.map(elem => ({ id: elem.id, value: elem.value })), 'id'))
  }, [props.setting.fieldList])

  return (
    <Block>
      <Grid container spacing={2} item xs={12} p={2}>
        <Grid item xs={12} sm={12} container spacing={2}>
          {props.setting.fieldList.map(field => {
            if (field.type === 'text' || field.type === 'password') {
              return (
                <Grid item xs={6}>
                  <FormElement name={field.name} textLabel={field.label}>
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type}
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
            if (field.type === 'checkbox') {
              return (
                <Grid item xs={12}>
                  <FormElement name={field.name} textLabel={field.label}>
                    <Checkbox
                      name={field.name}
                      onChange={(e: any) =>
                        setState({ ...state, [field.id]: !state[field.id]?.value })
                      }
                      value={state[field.id]?.value}
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
            onClick={() => props.onEdit(state)}
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