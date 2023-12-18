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

import { DBMSType } from "@/libs";
import { getDbmsTypes } from "../../../../api/data-sources";
import {
  Grid,
  Block,
  FormLabel,
  ImportJsonFile,
  EditableInput,
  EditableSelect
} from "../../../../libs/components";
import { DBMSTypesInterface } from "../../../../libs/types";
import { parseToSelectControlOptions } from "../../../../libs/utils";


export const ConnectionDetails: React.FC<{
  entity: any;
  updateEntity: (entity: any, file?: any) => void;
}> = ({ entity, updateEntity }) => {
  const [dbsmTypes, setDbsmTypes] = useState([]);
  useEffect(() => {
    getDbmsTypes().then((res: DBMSTypesInterface[]) => {
      setDbsmTypes(parseToSelectControlOptions<DBMSTypesInterface, DBMSType>(res));
    });
  }, []);

  if (dbsmTypes.length === 0) return;
  return (
    <Block>
      <Grid container spacing={2} item xs={12} p={2}>
        <Grid item xs={12} sm={6} container spacing={2}>
          <FormLabel htmlFor="database-type" label="Database Type" required>
            <EditableSelect
              value={entity.dbmsType}
              className=""
              fullWidth
              id="database-type"
              options={dbsmTypes}
              placeholder="Select type..."
              size="small"
              onSubmit={
                (newVal: any) => {
                  updateEntity({ ...entity, dbmsType: newVal });
                }
              }
              sx={{ ml: -1 }}
              onCancel={() => { }}
            />
          </FormLabel>

          <FormLabel
            htmlFor="connection-string"
            label="Connection String"
            required
          >
            <EditableInput
              value={entity.connectionString}
              className=""
              fullWidth
              id="connection-string"
              placeholder="Enter connection string..."
              size="small"
              onSubmit={(newVal: any) => {
                updateEntity({
                  ...entity,
                  connectionString: newVal,
                });
              }}
              sx={{ ml: -1 }}
              onCancel={() => { }}
              color="textColor.primary"
              required
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
          {entity.type !== "bigquery" ? (
            <>
              <FormLabel htmlFor="username" label="Username" required>
                <EditableInput
                  value={entity.dbUsername}
                  className=""
                  fullWidth
                  id="username"
                  placeholder="Enter username..."
                  size="small"
                  onSubmit={(newVal: any) => {
                    updateEntity({
                      ...entity,
                      dbUsername: entity.dbUsername,
                    });
                  }}
                  sx={{ ml: -1 }}
                  onCancel={() => { }}
                  color="textColor.primary"
                  required
                />
              </FormLabel>

              <FormLabel htmlFor="password" label="Password" required>
                <EditableInput
                  value={entity.dbPassword}
                  className=""
                  fullWidth
                  id="password"
                  type="password"
                  placeholder="Enter password..."
                  size="small"
                  onSubmit={(newVal: any) => {
                    updateEntity({
                      ...entity,
                      dbPassword: entity.dbPassword
                    });
                  }}
                  sx={{ ml: -1 }}
                  onCancel={() => { }}
                  color="textColor.primary"
                  required
                />
              </FormLabel>
            </>
          ) : (
            <Grid item xs={12}>
              <ImportJsonFile
                titleButton={"Upload keyfile"}
                initialTextFile={entity?.keyfileName} onChange={(parsedJson: any, file: any) => {
                  updateEntity(entity, file);
                }} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Block>
  );
};
