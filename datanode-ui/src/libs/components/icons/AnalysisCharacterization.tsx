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

export const AnalysisCharacterization: React.FC<any> = React.forwardRef(
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
        style={{ enableBackground: "new 0 0 160 160" }}
        xmlSpace="preserve"
        {...rest}
      >
        <g>
          <path
            d="M99.4,39.5c-2.2,0-4,1.8-4,4v19.2c0,2.2,1.8,4,4,4s4-1.8,4-4V43.5C103.4,41.3,101.6,39.5,99.4,39.5
		C99.4,39.5,99.4,39.5,99.4,39.5z"
          />
          <path
            d="M117.3,28.5c-2.2,0-4,1.8-4,4v30.2c0,2.2,1.8,4,4,4s4-1.8,4-4V32.5C121.3,30.3,119.5,28.5,117.3,28.5
		C117.3,28.5,117.3,28.5,117.3,28.5z"
          />
          <path
            d="M134.3,19c-2.2,0-4,1.8-4,4v39.6c0,2.2,1.8,4,4,4c2.2,0,4-1.8,4-4V23C138.3,20.8,136.5,19,134.3,19
		C134.3,19,134.3,19,134.3,19z"
          />
          <path
            d="M27.3,60.1l4.1,1.8l7.3,3.1l0,0l0.1,0l36.6,15.5l0.6,0.3l-0.4,1.1l-15.2,36l-3.1,7.3l0,0v0l-2,4.8
		c-11.6-6.9-20.6-17.4-25.7-30.2C24.3,87,23.6,73.2,27.3,60.1 M86.4,20.4c-23.2,0-43.2,14-51.9,34.1l-12-5.1
		c-15,35.4,1.4,76.2,36.6,91.5l5.4-12.7c7.1,3,14.7,4.6,22.4,4.6c10.5,0,21.1-2.9,30.5-9c15.4-10,25.4-27.5,25.6-47.2l-56.6-0.2
		L86.4,20.4L86.4,20.4L86.4,20.4z M78.4,73.1L41.9,57.6c2.4-5.6,5.9-10.7,10.3-15.1c7.2-7.2,16.3-11.8,26.2-13.4V73.1L78.4,73.1z
		 M86.9,124.9c-6.8,0-13.3-1.4-19.3-4l15.2-36l0.9-0.4l50.5,0.2c-2.3,13.3-9.9,25.1-21.2,32.5C105.2,122.2,96.2,124.9,86.9,124.9
		L86.9,124.9L86.9,124.9z"
          />
        </g>
      </svg>
    );
  }
);
