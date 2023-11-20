import { DBMSType } from '../../../../libs/enums';
import { Grid, FormLabel, ImportJsonFile, EditableInput } from '../../../../libs/components';

import { FC } from 'react';

export const OmopCdmSettings: FC<{
  entity: any;
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
              onSubmit={handleSave('cdmSchema')}
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
              onSubmit={handleSave('resultSchema')}
              sx={{ ml: -1 }}
              onCancel={() => { }}
              color="textColor.primary"
              required
            />
          </FormLabel>
          <FormLabel htmlFor="targetSchema" label="Cohort Schema">
            <EditableInput
              value={entity.targetSchema}
              className=""
              fullWidth
              id="targetSchema"
              placeholder="Enter cohort schema..."
              size="small"
              onSubmit={handleSave('targetSchema')}
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
          {entity.type !== DBMSType.BIGQUERY ? (
            <>
              {/* <FormLabel
                htmlFor="adminUsername"
                label="Admin Username"
                required
              >
                <EditableInput
                  value={entity.dbUsername}
                  className=""
                  fullWidth
                  id="adminUsernamee"
                  placeholder="Enter admin username..."
                  size="small"
                  onSubmit={(newVal: any) => {
                    updateEntity({
                      ...entity,
                      dbUsername: newVal
                    });
                  }}
                  sx={{ ml: -1 }}
                  onCancel={() => { }}
                  color="textColor.primary"
                  required
                />
              </FormLabel>
              <FormLabel
                htmlFor="adminPassword"
                label="Admin Password"
                required
              >
                <EditableInput
                  value={entity.dbPassword}
                  className=""
                  fullWidth
                  id="adminPassword"
                  type="password"
                  placeholder="Enter admin password..."
                  size="small"
                  onSubmit={(newVal: any) => {
                    updateEntity({
                      ...entity,
                      dbPassword: newVal,
                    });
                  }}
                  sx={{ ml: -1 }}
                  onCancel={() => { }}
                  color="textColor.primary"
                  required
                />
              </FormLabel> */}
            </>
          ) : (
            <Grid item xs={12}>
              <ImportJsonFile
                titleButton={'Upload keyfile'}
                initialTextFile={entity?.adminKeyfileName} onChange={(parsedJson: any, file: any) => {
                  updateEntity(entity, file, true);
                }} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};
