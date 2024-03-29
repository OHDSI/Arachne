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

export const DataCatalog: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    const theme = useTheme();
    return (
      <svg
        ref={ref}
        version="1.1"
        id="dataCatalog"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 160 160"
        xmlSpace="preserve"
        {...rest}
      >
        <g>
          <path
            fill={plain ? "transparent" : "#F0F8FE"}
            d="M25.2,29.7v69.5c0,3.7,3,6.7,6.7,6.7c0,0,0,0,0,0h110.8c3.1,0,5.5-2.5,5.5-5.5V37.6c0-2.8-2.3-5.2-5.1-5.2
		c0,0,0,0,0,0H85.5c-1,0-1.9-0.4-2.5-1.1L72.9,21.3c-0.6-0.6-1.5-1-2.4-1l-36.1,0.2C29.3,20.5,25.2,24.6,25.2,29.7z"
          />
          <path
            fill={plain ? "evenodd" : theme.palette.primary.main}
            d="M149.5,31.1c-1.7-1.7-4-2.7-6.5-2.7H85.7l-10-10l0,0c-1.4-1.4-3.3-2.2-5.2-2.2l0,0l-36.1,0.2
		c-7.3,0-13.2,5.9-13.2,13.2v69.5c0,5.9,4.8,10.7,10.7,10.7h110.8c5.3,0,9.5-4.3,9.5-9.5V37.6C152.2,35.2,151.2,32.9,149.5,31.1z
		 M144.1,100.4c0,0.4-0.2,0.8-0.4,1.1c-0.3,0.3-0.7,0.4-1.1,0.4H31.8c-0.7,0-1.4-0.3-1.9-0.8c-0.5-0.5-0.8-1.2-0.8-1.9V29.7
		c0-2.9,2.3-5.2,5.2-5.2l35.9-0.2l9.9,9.9l0,0c1.4,1.4,3.4,2.2,5.4,2.2H143c0.3,0,0.6,0.1,0.8,0.3c0.2,0.2,0.3,0.5,0.3,0.8V100.4z"
          />
          <path
            fill={plain ? "transparent" : "#F0F8FE"}
            d="M11.1,63.5V133c0,3.7,3,6.7,6.7,6.7h0h110.8c3.1,0,5.5-2.5,5.5-5.5V71.4c0-2.8-2.3-5.1-5.1-5.2H71.5
		c-0.9,0-1.8-0.4-2.5-1.1L58.8,55.1c-0.6-0.6-1.5-1-2.4-1l-36.1,0.3C15.3,54.4,11.2,58.5,11.1,63.5z"
          />
          <path
            fill={plain ? "evenodd" : theme.palette.primary.main}
            d="M135.4,65c-1.7-1.7-4-2.7-6.4-2.7H71.7l-10-10c-1.4-1.4-3.3-2.2-5.2-2.2l0,0l-36.2,0.2
		c-7.2,0-13.1,5.9-13.1,13.1V133c0,5.9,4.8,10.7,10.7,10.7h110.8c5.3,0,9.5-4.3,9.5-9.5V71.4C138.1,69,137.2,66.7,135.4,65z
		 M130.1,134.2c0,0.4-0.2,0.8-0.4,1.1c-0.3,0.3-0.7,0.5-1.1,0.4H17.8c-0.7,0-1.4-0.3-1.9-0.8c-0.5-0.5-0.8-1.2-0.8-1.9V63.5
		c0-2.8,2.3-5.1,5.2-5.1l35.9-0.2l9.9,9.9c1.4,1.4,3.4,2.2,5.4,2.2H129c0.6,0,1.1,0.5,1.1,1.1c0,0,0,0,0,0L130.1,134.2z"
          />
        </g>
      </svg>
    );
  }
);
