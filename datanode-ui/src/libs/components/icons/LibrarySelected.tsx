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

export const LibrarySelected: React.FC<any> = React.forwardRef(
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
        <path
          fill="rgb(211, 210, 247)"
          d="M144,73.7h-25.2V84c0,5.4-4.4,9.8-9.8,9.8H51c-5.4,0-9.8-4.4-9.8-9.8V73.7H16c-1.2,0-2.2,1-2.2,2.3v68.2
	c0,1.2,1,2.3,2.2,2.3h128c1.2,0,2.2-1,2.2-2.3V76C146.2,74.7,145.2,73.7,144,73.7z M102.9,131.2H58v-21.1h44.9
	C102.9,110.1,102.9,131.2,102.9,131.2z"
        />
        <path
          fill={theme.palette.primary.main}
          d="M98.9,112.5v15.2H61.1v-15.2H98.9 M106.4,105H53.6v24.2c0,3.3,2.7,6,6,6h40.8c3.3,0,6-2.7,6-6V105z"
        />
        <g>
          <path
            fill={theme.palette.primary.main}
            d="M104.6,17.7H48.1c-3.3,0-6,2.7-6,6v6.6h7.5v-5.1h53.5v5.1h7.5v-6.6C110.6,20.4,107.9,17.7,104.6,17.7z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M149.7,74l-26.6-61.5c-0.8-1.9-3-2.8-4.9-1.9s-2.8,3-1.9,4.9L139.8,70H115V84c0,3.3-2.7,6-6,6H51
		c-3.3,0-6-2.7-6-6V70H20.2l23.6-54.6c0.8-1.9,0-4.1-2-4.9s-4.1,0.1-4.9,1.9L10.3,74c-0.2,0.5-0.3,1.1-0.3,1.7c0,0.1,0,0.2,0,0.4
		v68.2c0,3.3,2.7,6,6,6h128c3.3,0,6-2.7,6-6V76c0-0.1,0-0.2,0-0.4C150,75.1,149.9,74.5,149.7,74z M142.5,142.6h-125V77.5h20V84
		c0,7.5,6.1,13.5,13.5,13.5h58c7.4,0,13.5-6.1,13.5-13.5v-6.5h20V142.6z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M116.1,35.4H44.2c-3.3,0-6,2.7-6,6v6h7.5v-4.5h68.8v4.5h7.5v-6C122.1,38.1,119.4,35.4,116.1,35.4z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M129.7,65v-6.5c0-3.3-2.7-6-6-6H36.6c-3.3,0-6,2.7-6,6V65h7.5v-5h84.1v5H129.7z"
          />
        </g>
      </svg>
    );
  }
);
