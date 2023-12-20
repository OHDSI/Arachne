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

import { Button, Tooltip } from "@mui/material";
import React from "react";
import { Icon } from "../../Icon/Icon";
import { Grid } from "../../Grid";

export const EditableComponentActions: React.FC<{
  onSubmit: () => void;
  onCancel: () => void;
  disableSubmit?: boolean;
  submitErrorMessage?: string;
}> = ({ onSubmit, onCancel, disableSubmit, submitErrorMessage = "" }) => {
  return (
    <Grid className="editable-component-actions" container>
      <Tooltip
        title={disableSubmit && submitErrorMessage ? submitErrorMessage : ""}
      >
        <div>
          <Button
            name="editable-component-save"
            sx={theme => ({
              minWidth: 0,
              p: 0,
              backgroundColor: "#ffffff",
              height: 30,
              width: 30,
              "&.Mui-disabled": {
                backgroundColor: "backgroundColor.main",
                boxShadow: theme.shadows[2],
              },
            })}
            color="inherit"
            variant="contained"
            onClick={onSubmit}
            disabled={disableSubmit}
          >
            <Icon
              iconName="check"
              color={disableSubmit ? "disabled" : "success"}
            />
          </Button>
        </div>
      </Tooltip>
      <Button
        name="editable-component-cancel"
        sx={{
          minWidth: 0,
          p: 0,
          backgroundColor: "#ffffff",
          height: 30,
          width: 30,
          ml: 0.5,
        }}
        color="inherit"
        variant="contained"
        onClick={onCancel}
      >
        <Icon iconName="deactivate" color="error" sx={{ fontSize: 16 }} />
      </Button>
    </Grid>
  );
};
