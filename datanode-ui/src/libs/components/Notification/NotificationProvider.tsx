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

import { SnackbarProvider, SnackbarProviderProps } from "notistack";
import React from "react";
import { Notification } from "./Notification";
import { classes } from "./Notification.styles";

export const NotificationsProvider: React.FC<SnackbarProviderProps> = props => {
  return (
    <SnackbarProvider
      maxSnack={props.maxSnack}
      anchorOrigin={props.anchorOrigin}
      classes={{
        containerRoot: classes.root,
      }}
      Components={{
        default: Notification,
        success: Notification,
        error: Notification,
        info: Notification,
        warning: Notification,
      }}
    >
      {props.children}
    </SnackbarProvider>
  );
};
