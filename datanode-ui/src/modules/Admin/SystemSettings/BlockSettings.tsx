import React, { useEffect, useState } from "react";

import { convertListToHashMap } from "../../../libs/utils";
import {
  Block,
  Button,
  FormElement,
  Grid,
  Icon,
  Input,
  Spinner,
  Checkbox
} from "../../../libs/components";

interface BlockSettingsPropsInterface {
  setting: any;
  isLoading: boolean;
  onEdit: (values: any) => void;
}

export const BlockSettings: React.FC<BlockSettingsPropsInterface> = (props) => {
  const {
    setting,
    isLoading,
    onEdit
  } = props;
  const [state, setState] = useState(convertListToHashMap(setting.fieldList, 'id'));


  useEffect(() => {
    setState(convertListToHashMap(setting.fieldList.map(elem => ({ id: elem.id, value: elem.value })), 'id'))
  }, [setting.fieldList])



  return (
    <Block>
      <Grid container spacing={2} item xs={12} p={2}>
        <Grid item xs={12} sm={12} container spacing={2}>
          {setting.fieldList.map(field => (
            <Grid item xs={field.type === 'checkbox' ? 12 : 6}>
              <FormElement name={field.name} textLabel={field.label}>
                {field.type === 'checkbox' ? (
                  <Checkbox
                    name={field.name}
                    onChange={(e: any) =>
                      setState({ ...state, [field.id]: !state[field.id]?.value })
                    }
                    value={state[field.id]?.value}
                  />
                ) : (
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
                )}
              </FormElement>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} mt={2} display="flex" justifyContent="flex-end">
          <Button
            disabled={isLoading}
            onClick={() => onEdit(state)}
            variant="contained"
            size="small"
            color="success"
            startIcon={
              !isLoading ? <Icon iconName="submit" /> : <Spinner size={16} />
            }
            sx={{ ml: 2 }}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Block>
  )
}