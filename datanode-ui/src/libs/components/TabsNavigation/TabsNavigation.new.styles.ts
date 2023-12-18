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

import styled, { StyledComponent } from "@emotion/styled";
import { AnyAction } from "redux";


export const TabsContainer: any = styled("div", { shouldForwardProp: prop => prop !== "secondary" })(
  ({ theme, secondary }: any) => ({
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    padding: 0,
    ".tab": {
      position: "relative",
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      padding: "14px 12px",
      fontSize: secondary ? 14 : 16,
      fontWeight: 400,
      textAlign: "center",
      color: theme.palette.textColor.primary,
      opacity: 0.8,
      cursor: "pointer",
      [theme.breakpoints.down("lg")]: {
        padding: "14px",
      },
    },
    ".tab:not(:last-of-type)": {
      marginRight: secondary ? 0 : "12px",
    },
    ".tab.active": {
      fontWeight: 600,
      color: theme.palette.textColor.primary,
    },
    ".tab::after": {
      content: "''",
      position: "absolute",
      bottom: 0,
      // left: 0,
      height: 4,
      width: "0",
      backgroundColor: theme.palette.info.main,
      transition: "300ms",
      left: "50%",
      transform: "translateX(-50%, 0)",
    },
    ".tab.active::after": {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      height: 4,
      width: "100%",
      backgroundColor: theme.palette.info.main,
    },
  })
);
