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

import { useTheme } from "@mui/material";
import React from "react";

export const WorkspaceSelected: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    const theme = useTheme();
    return (
      <svg
        ref={ref}
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 160 160"
        xmlSpace="preserve"
        {...rest}
      >
        <path
          fill="#b5eef4"
          d="M16,14h49.6c1.1,0,2,0.9,2,2v70.5c0,1.1-0.9,2-2,2H16c-1.1,0-2-0.9-2-2V16C14,14.9,14.9,14,16,14z"
        />
        <path
          fill="#b5eef4"
          d="M94.4,71H144c1.1,0,2,0.9,2,2v70.5c0,1.1-0.9,2-2,2H94.4c-1.1,0-2-0.9-2-2V73C92.4,71.9,93.3,71,94.4,71z"
        />
        <path
          fill="#b5eef4"
          d="M94.4,14H144c1.1,0,2,0.9,2,2v29.2c0,1.1-0.9,2-2,2H94.4c-1.1,0-2-0.9-2-2V16C92.4,14.9,93.3,14,94.4,14z"
        />
        <path
          fill="#b5eef4"
          d="M16,112.8h49.6c1.1,0,2,0.9,2,2V144c0,1.1-0.9,2-2,2H16c-1.1,0-2-0.9-2-2v-29.2C14,113.7,14.9,112.8,16,112.8z"
        />
        <g>
          <path
            fill={theme.palette.primary.main || "#A9BAD4"}
            d="M65.7,10H16c-3.3,0-6,2.7-6,6v70.5c0,3.3,2.7,6,6,6h49.7c3.3,0,6-2.7,6-6V16C71.7,12.7,69,10,65.7,10z
		 M63.7,84.5H18V18h45.7V84.5z"
          />
          <path
            fill={theme.palette.primary.main || "#A9BAD4"}
            d="M144,67H94.4c-3.3,0-6,2.7-6,6v70.5c0,3.3,2.7,6,6,6H144c3.3,0,6-2.7,6-6V73C150,69.7,147.3,67,144,67z
		 M142,141.5H96.4V75H142V141.5z"
          />
          <path
            fill={theme.palette.primary.main || "#A9BAD4"}
            d="M144,10H94.4c-3.3,0-6,2.7-6,6v29.2c0,3.3,2.7,6,6,6H144c3.3,0,6-2.7,6-6V16C150,12.7,147.3,10,144,10z
		 M142,43.2H96.4V18H142V43.2z"
          />
          <path
            fill={theme.palette.primary.main || "#A9BAD4"}
            d="M65.6,108.8H16c-3.3,0-6,2.7-6,6V144c0,3.3,2.7,6,6,6h49.6c3.3,0,6-2.7,6-6v-29.2
		C71.6,111.5,68.9,108.8,65.6,108.8z M63.6,142H18v-25.2h45.6L63.6,142z"
          />
        </g>
      </svg>
    );
  }
);
