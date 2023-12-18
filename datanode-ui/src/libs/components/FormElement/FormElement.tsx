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

import React, { memo } from "react";
import { Grid } from "../Grid";
import { Typography } from "@mui/material";
import { FormElementContainer } from "../Content";

export const FormElement: React.FC<any> = memo(props => {
  const { name, textLabel, required, children, inline } = props;

  return (
    <FormElementContainer inline={inline}>
      <label htmlFor={name}>
        {textLabel}
        {required ? <span className="required">*</span> : <></>}
      </label>
      {children}
    </FormElementContainer>
  );
});

export const FormLabel: React.FC<{
  htmlFor?: string;
  label: string;
  required?: boolean;
  children?: React.ReactNode;
}> = props => {
  const { htmlFor, label, required, children } = props;

  return (
    <Grid item xs={12}>
      <Typography
        variant="subtitle1"
        component="label"
        sx={{
          sup: {
            color: "error.main",
            ml: 0.25,
          },
        }}
        htmlFor={htmlFor}
      >
        {label}
        {required ? <sup className="required">*</sup> : <></>}
      </Typography>
      {children}
    </Grid>
  );
};

export const InlineFormElement: React.FC<any> = props => {
  const { name, textLabel, required, children, description, labelSize } = props;

  return (
    <Grid
      item
      xs={12}
      sx={{
        "&:hover": {
          backgroundColor: "backgroundColor.main",
          borderRadius: 1,
        },
      }}
    >
      <Grid container alignItems="center" columnSpacing={2} p={1}>
        <Grid item xs={labelSize || 7}>
          <Typography
            component="label"
            variant="subtitle2"
            htmlFor={name}
            sx={{
              // fontSize: 14,
              fontWeight: 600,
              ".required": { color: "error.main" },
            }}
          >
            {textLabel}
            {required ? <span className="required">*</span> : <></>}
          </Typography>
          {description && (
            <Typography variant="subtitle2">{description}</Typography>
          )}
        </Grid>
        <Grid item xs={12 - (labelSize || 7)}>
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
};
