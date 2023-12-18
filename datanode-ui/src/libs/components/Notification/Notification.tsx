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

import React, { forwardRef } from "react";
import { Alert, AlertProps } from "@mui/material";

export type Message = {
  message?: React.ReactNode | string;
  variant?: any;
  onClose?: ((key: any) => void) | undefined;
  id?: any;
};

export type VariantType = "default" | "error" | "success" | "warning" | "info";

export const Notification = forwardRef<HTMLDivElement, AlertProps & Message>(
  (props, ref) => {
    const onClose: any = React.useMemo(
      () => (props.onClose ? () => props.onClose(props.id) : null),
      [props.onClose, props.id]
    );

    return (
      <Alert
        ref={ref}
        severity={
          ["error", "info", "success", "warning"].includes(props.variant)
            ? props.variant
            : "success"
        }
        variant="standard"
        onClose={onClose}
        key={props.id}
      >
        {props.message}
      </Alert>
    );
  }
);
