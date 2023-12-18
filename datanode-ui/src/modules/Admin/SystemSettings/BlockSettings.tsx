/*
 *
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
  const [state, setState] = useState(convertListToHashMap(setting.fieldList, "id"));


  useEffect(() => {
    setState(convertListToHashMap(setting.fieldList.map(elem => ({ id: elem.id, value: elem.value })), "id"));
  }, [setting.fieldList]);



  return (
    <Block>
      <Grid container spacing={2} item xs={12} p={2}>
        <Grid item xs={12} sm={12} container spacing={2}>
          {setting.fieldList.map(field => (
            <Grid item xs={field.type === "checkbox" ? 12 : 6}>
              <FormElement name={field.name} textLabel={field.label}>
                {field.type === "checkbox" ? (
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
  );
};