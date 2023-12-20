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

import React from "react";
import { useNavigate } from "react-router";
import { useTheme } from "@mui/material";

import { Button, Grid, IconActionButton, EditableInput } from "../../../libs/components";
import { DataSourceDTOInterface } from "../../../libs/types";

export interface DatabaseBaseInfoProps {
  entity: DataSourceDTOInterface;
  onSubmit: (val: DataSourceDTOInterface) => void;
  onDelete: () => void;
}
export const DatabaseBaseInfo: React.FC<DatabaseBaseInfoProps> = ({
  entity,
  onSubmit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const theme: any = useTheme();

  const updateFiled = (fieldName: string, newValue: string) => {
    onSubmit({ ...entity, [fieldName]: newValue });
  };

  return (
    <Grid container py={1.5} pb={2} alignItems="center" spacing={0.5}>
      <Grid item xs={12} container alignItems="center">
        <Grid item flexGrow={1} mx={-1}>
          <EditableInput
            size="medium"
            value={entity.name}
            fullWidth
            color={theme.palette.textColor.primary}
            onSubmit={(value) => {
              updateFiled("name", value);
            }}
            name="database-name"
            required
          />
        </Grid>
        <Grid item display="flex" alignItems="center">
          <Grid item>
            <Button size="xsmall" color="info" onClick={() => navigate("..")}>
              {"<"} Back to Databases
            </Button>
          </Grid>
          <Grid item ml={1}>
            <IconActionButton
              color="error"
              iconName="delete"
              onClick={onDelete}
              tooltipText="Delete"
              name="analysis-delete"
            />
          </Grid>
        </Grid>
      </Grid>{" "}
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          container
          justifyContent="space-between"
          alignItems="center"
        >
        </Grid>
      </Grid>
      <Grid item xs={12} mx={-1}>
        <EditableInput
          size="small"
          value={entity.description}
          fullWidth
          color={theme.palette.textColor.primary}
          onSubmit={(value) => {
            updateFiled("description", value);
          }}
          name="database-description"
          multiline
          maxRows={3}
        />
      </Grid>
    </Grid>
  );
};
