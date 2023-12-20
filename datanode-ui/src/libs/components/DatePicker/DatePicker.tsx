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

import React, { useMemo, memo } from "react";
import { DesktopDatePicker as MUIDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import { setLightness } from "polished";

export type DatePickerProps = {
  id?: string;
  size?: "small" | "medium";
  format?: string;
  value?: any;
  disabled?: boolean;
  fullWidth?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  placeholder?: string;
  minDate?: any;
  maxDate?: any;
  onChange: (e: any) => void;
  className?: string;
  mask?: string;
  name?: string;
  label?: string;
};

export const DatePicker: React.FC<DatePickerProps> = props => {
  const locale = useMemo(() => navigator.language, [navigator.language]);
  const pickerProps = {
    ...(props.format
      ? {
        inputFormat: props.format,
      }
      : {}),
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
      <MUIDatePicker
        label={props.label}
        value={props.value != null ? moment(props.value) : null}
        minDate={props.minDate}
        maxDate={props.maxDate}
        onChange={props.onChange}
        disabled={props.disabled}
        disableFuture={props.disableFuture}
        disablePast={props.disablePast}
        sx={theme => ({
          backgroundColor: "#ffffff",
          ".MuiInputBase-input": {
            padding: props.size === "small" ? "3px 6px" : "6px 12px",
            fontSize: 13,
          },
          ".MuiButtonBase-root": {
            p: props.size === "small" ? 0 : 0.5,
          },
          ".MuiSvgIcon-root": {
            fontSize: 20,
            color: "secondary.main",
          },
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "borderColor.main",
          },
          "&:hover": {
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: setLightness(0.7, theme.palette?.primary.main),
            },
          },
        })}
        {...pickerProps}
      />
    </LocalizationProvider>
  );
};
