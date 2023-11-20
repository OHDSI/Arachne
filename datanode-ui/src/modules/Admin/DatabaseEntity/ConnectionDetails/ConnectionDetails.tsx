import { getDbmsTypes } from '../../../../api/data-sources';
import { Grid, Block, FormLabel, ImportJsonFile, EditableInput, EditableSelect } from '../../../../libs/components';
import { DBMSTypesInterface } from '../../../../libs/types';
import { parseDbmsTypesForSelectForm } from '../../../../libs/utils';

import { FC, useEffect, useState } from 'react';

export const ConnectionDetails: FC<{
  entity: any;
  updateEntity: (entity: any, file?: any) => void;
}> = ({ entity, updateEntity }) => {
  const [dbsmTypes, setDbsmTypes] = useState([]);
  useEffect(() => {
    getDbmsTypes().then((res: DBMSTypesInterface[]) => {
      setDbsmTypes(parseDbmsTypesForSelectForm(res));
    });
  }, []);
  console.log(entity, dbsmTypes)

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
                // updateFiled('type', newVal)
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
          {entity.type !== 'bigquery' ? (
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
                titleButton={'Upload keyfile'}
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
