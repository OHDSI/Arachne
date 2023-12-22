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

import { DBMSType } from "../../../../libs/enums";
import { Grid, FormLabel, ImportJsonFile, EditableInput } from "../../../../libs/components";

import React from "react";
import { DataSourceDTOInterface } from "../../../../libs/types";

export const OmopCdmSettings: React.FC<{
  entity: DataSourceDTOInterface;
  updateEntity: (newEntity: any, keyFile?: string, isAdmin?: boolean) => void;
}> = ({ entity, updateEntity }) => {

  const handleSave = (fieldName: string) => (value: any) => {
    updateEntity({ ...entity, [fieldName]: value });
  };

  return (
    <>
      <Grid container spacing={2} item xs={12} p={2}>
        <Grid item xs={12} sm={6} container spacing={2}>
          <FormLabel htmlFor="cdm-schema" label="CDM Schema" required>
            <EditableInput
              value={entity.cdmSchema}
              className=""
              fullWidth
              id="cdm-schema"
              placeholder="Enter cdm schema..."
              size="small"
              onSubmit={handleSave("cdmSchema")}
              sx={{ ml: -1 }}
              onCancel={() => { }}
              color="textColor.primary"
              required
            />
          </FormLabel>
          <FormLabel htmlFor="resultSchema" label="Results Schema" required>
            <EditableInput
              value={entity.resultSchema}
              className=""
              fullWidth
              id="resultSchema"
              placeholder="Enter result schema..."
              size="small"
              onSubmit={handleSave("resultSchema")}
              sx={{ ml: -1 }}
              onCancel={() => { }}
              color="textColor.primary"
              required
            />
          </FormLabel>
          <FormLabel htmlFor="targetSchema" label="Target Schema">
            <EditableInput
              value={entity.targetSchema}
              className=""
              fullWidth
              id="targetSchema"
              placeholder="Enter Target Schema..."
              size="small"
              onSubmit={handleSave("targetSchema")}
              sx={{ ml: -1 }}
              onCancel={() => { }}
              color="textColor.primary"
            />
          </FormLabel>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          container
          spacing={2}
          alignContent="flex-start"
        >
          {entity.dbmsType === DBMSType.BIGQUERY && (
            <Grid item xs={12}>
              <ImportJsonFile
                titleButton={"Upload keyfile"}
                initialTextFile={entity.hasKeytab} onChange={(parsedJson: any, file: any) => {
                  updateEntity(entity, file, true);
                }} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};
