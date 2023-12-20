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

import React from "react";
import { useTheme } from "@mui/material";

export const EmptyTable: React.FC<any> = React.forwardRef(
  ({ plain, color, ...rest }, ref) => {
    const theme: any = useTheme();
    return (
      <svg
        ref={ref}
        version="1.1"
        id="empty-table"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 500 500"
        style={{ enableBackground: "new 0 0 500 500" }}
        xmlSpace="preserve"
        {...rest}
      >
        <g>
          <circle
            fill={theme.palette.backgroundColor.main}
            cx="250"
            cy="250"
            r="250"
          />
          <rect x="106.4" y="150.2" fill="#D5DEEC" width="87.2" height="24.8" />
          <path
            fill={theme.palette.borderColor.main}
            d="M347.4,215h11.8c3.5,0,6.1,2.2,6.1,5.1s-2.5,5.2-6,5.2c-8,0-15.9,0-23.9,0c-3.5,0-6-2.2-6-5.2s2.5-5.1,5.9-5.1
			C339.3,215,343.4,215,347.4,215"
          />
          <path
            fill={theme.palette.borderColor.main}
            d="M147.6,251.1c3.9,0,7.8,0,11.8,0c3.6,0,6.1,2.3,6.1,5.3c0,3-2.7,5-6.2,5c-7.8,0-15.7,0-23.5,0
			c-3.6,0-6.2-2.2-6.2-5.2s2.6-5.1,6.1-5.1C139.7,251.1,143.7,251.1,147.6,251.1"
          />
          <path
            fill={theme.palette.borderColor.main}
            d="M147.6,302.7c-3.9,0-7.8,0-11.8,0c-3.6,0-6.2-2.2-6.2-5.2s2.6-5.1,6.2-5.1h23.5c3.5,0,6.1,2.2,6.1,5.1
			s-2.5,5.2-6.1,5.2C155.4,302.7,151.5,302.7,147.6,302.7"
          />
          <path
            fill={theme.palette.borderColor.main}
            d="M147.4,338.9c-3.9,0-7.8,0-11.8,0c-3.5,0-6.1-2.2-6.1-5.1s2.6-5.2,6.2-5.2c7.8,0,15.7,0,23.5,0
			c3.6,0,6.2,2.2,6.2,5.2s-2.6,5.1-6.3,5.1H147.4"
          />
          <path
            fill={theme.palette.borderColor.main}
            d="M147.4,225.3c-3.9,0-7.8,0-11.8,0c-3.5,0-6-2.2-6-5.2s2.6-5.1,6-5.1c7.9,0,15.8,0,23.7,0
			c3.5,0,6.1,2.2,6.1,5.1s-2.6,5.2-6.1,5.2C155.3,225.3,151.3,225.3,147.4,225.3"
          />
          <path
            fill={theme.palette.borderColor.main}
            d="M250,225.3c-3.9,0-7.8,0-11.8,0c-3.6,0-6.2-2.2-6.2-5.2s2.6-5.1,6.2-5.1c7.8,0,15.5,0,23.3,0
			c3.7,0,6.3,2.2,6.3,5.2s-2.7,5.1-6.3,5.1L250,225.3"
          />
          <path
            fill={theme.palette.borderColor.main}
            d="M249.9,302.7c-3.9,0-7.8,0-11.8,0c-3.5,0-6.1-2.2-6.1-5.1s2.5-5.1,6-5.1c8,0,15.9,0,23.9,0c3.4,0,5.9,2.2,6,5
			s-2.5,5.2-5.9,5.2C258,302.7,253.9,302.7,249.9,302.7"
          />
          <path
            fill={theme.palette.borderColor.main}
            d="M250,338.9h-11.7c-3.6,0-6.2-2.2-6.2-5.2s2.6-5.1,6.2-5.1c7.8,0,15.7,0,23.5,0c3.5,0,6.1,2.2,6.1,5.1
			s-2.5,5.2-6.1,5.2C257.9,338.8,253.9,338.8,250,338.9"
          />
          <path
            fill={theme.palette.borderColor.main}
            d="M249.9,261.4c-3.9,0-7.8,0-11.8,0c-3.5,0-6.1-2.2-6.1-5.1s2.5-5.2,6-5.2c8,0,15.9,0,23.9,0c3.4,0,6,2.3,6,5.2
			s-2.6,5.1-5.9,5.1C258,261.4,253.9,261.4,249.9,261.4"
          />
          <path
            fill={theme.palette.borderColor.main}
            d="M270.8,362.3h-64.5V187.6h87.2v70.5c4-3.4,8.3-6.4,12.8-9v-61.5h87.2v61.5c4.4,2.6,8.7,5.5,12.6,8.8
			c0-37.7,0-75.3,0.1-113c0.2-3.9-2.7-7.2-6.6-7.4c-0.3,0-0.6,0-0.9,0c-49.6,0.1-99.2,0.1-148.7,0.1h-69.3c-26.7,0-53.3,0-80,0.1
			c-1.7,0.1-3.3,0.6-4.7,1.5c-2,1.2-2.2,3.4-2.2,5.7c0,74.3,0,148.6,0,222.9c-0.2,3.9,2.8,7.1,6.7,7.3c0.2,0,0.5,0,0.7,0
			c59-0.1,118-0.1,177.1-0.1C275.4,371,273,366.7,270.8,362.3z M306.3,150.2h87.2V175h-87.2V150.2z M206.4,150.2h87.2V175h-87.2
			V150.2z M106.4,150.2h87.2V175h-87.2L106.4,150.2z M193.6,362.3h-87.2V187.7h87.2L193.6,362.3z"
          />
          <g>
            <path
              fill={
                color
                  ? theme.palette[color].main
                  : theme.palette.info.main + "e0"
              }
              d="M378.4,296.6c-15.7-15.9-41.2-16-57.1-0.3c-15.9,15.7-16,41.2-0.3,57.1c15.7,15.9,41.2,16,57.1,0.3
				c10.2-10.1,14.3-25,10.7-38.9C387,307.9,383.4,301.6,378.4,296.6z M371.2,339.3l-7,7L350,332l-14.3,14.3l-7-7L343,325l-14.3-14.3
				l7-7L350,318l14.3-14.3l7,7L357,325L371.2,339.3z"
            />
            <path
              fill={
                color
                  ? theme.palette[color].main
                  : theme.palette.info.main + "82"
              }
              d="M350,256.2c-38,0-68.8,30.8-68.8,68.8s30.8,68.8,68.8,68.8s68.8-30.8,68.8-68.8l0,0
				C418.8,287,388,256.2,350,256.2z M398.4,337.6c-4.6,17.5-18.3,31.2-35.9,35.9c-8.3,2.2-17,2.2-25.2-0.1c-26.7-7-42.8-34.3-35.8-61
				c4.6-17.6,18.3-31.3,35.9-35.8c8.2-2.3,16.9-2.3,25.2,0c17.5,4.6,31.2,18.3,35.9,35.9C400.7,320.7,400.7,329.3,398.4,337.6
				L398.4,337.6z"
            />
          </g>
          <rect x="106.2" y="150" fill="none" width="87.5" height="25" />
        </g>
      </svg>
    );
  }
);
