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

export const Studies: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    const theme = useTheme();
    return (
      <svg
        ref={ref}
        version="1.1"
        id="studies"
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
          fill={plain ? "transparent" : "#F0F8FE"}
          d="M129.3,72.7c0-7.6-3.4-14.4-8.7-19V19.9h-98c-4.8,0-8.8,3.9-8.8,8.8v102.7c0,4.9,3.9,8.8,8.8,8.8h97.9V91.7
	C125.9,87.1,129.3,80.3,129.3,72.7z"
        />
        <path
          fill={plain ? "transparent" : "#F0F8FE"}
          d="M104,121.8H23c-5,0-9.1,4.1-9.1,9.2l0,0c0,5.1,4.1,9.1,9.1,9.1h97.6V19.9H104V121.8z"
        />
        <path
          fill={plain ? "evenodd" : theme.palette.primary.main}
          d="M29.5,39.8h25.1c2.2,0,3.9-1.7,3.9-3.9S56.7,32,54.6,32H29.5c-2.1,0-3.9,1.7-3.9,3.9S27.4,39.8,29.5,39.8"
        />
        <path
          fill={plain ? "evenodd" : theme.palette.primary.main}
          d="M29.5,54.4h25.1c2.2,0,3.9-1.7,3.9-3.9s-1.7-3.9-3.9-3.9H29.5c-2.1,0-3.9,1.7-3.9,3.9S27.4,54.4,29.5,54.4"
        />
        <path
          fill={plain ? "evenodd" : theme.palette.primary.main}
          d="M29.5,69.1h25.1c2.2,0,3.9-1.7,3.9-3.9s-1.7-3.9-3.9-3.9H29.5c-2.1,0-3.9,1.7-3.9,3.9
	C25.6,67.3,27.4,69.1,29.5,69.1"
        />
        <path
          fill={plain ? "evenodd" : theme.palette.primary.main}
          d="M148.9,109.6l-18.4-18.4c3.7-5.2,5.9-11.6,5.9-18.5c0-8.8-3.6-16.8-9.3-22.5c-0.8-0.8-1.7-1.6-2.6-2.3v-28
	c0-1-0.4-2-1.1-2.8c-0.7-0.7-1.7-1.1-2.8-1.1h-98c-3.5,0-6.7,1.4-8.9,3.7c-2.3,2.3-3.7,5.5-3.7,8.9v102.7c0,3.5,1.4,6.7,3.7,9
	c2.3,2.3,5.5,3.7,9,3.7h97.9c1,0,2-0.4,2.8-1.1s1.1-1.7,1.1-2.8V97.5c0.2-0.2,0.5-0.4,0.7-0.6l18.2,18.2c1.5,1.5,4,1.5,5.5,0
	S150.4,111.1,148.9,109.6L148.9,109.6z M107.9,23.8h8.8v19.5c-2.8-1.2-5.7-1.9-8.8-2.2C107.9,41,107.9,23.8,107.9,23.8z M17.8,28.6
	c0-1.4,0.5-2.5,1.4-3.4c0.9-0.9,2.1-1.4,3.4-1.4h77.5v17.4c-7,1-13.3,4.2-18,9c-5.8,5.8-9.3,13.7-9.3,22.5c0,8.8,3.6,16.8,9.3,22.5
	c4.8,4.8,11,8,18,9V118H23c-1.9,0-3.6,0.4-5.2,1.1L17.8,28.6L17.8,28.6z M116.7,136.2H23c-1.5,0-2.8-0.6-3.7-1.5
	c-1-1-1.5-2.2-1.5-3.7l0,0c0-1.5,0.6-2.8,1.5-3.7c1-1,2.2-1.5,3.7-1.5H104c1,0,2-0.4,2.8-1.1s1.1-1.7,1.1-2.8v-17.5
	c3.1-0.3,6.1-1.1,8.8-2.2L116.7,136.2L116.7,136.2z M128.6,72.7L128.6,72.7c0,0.6,0,1.1-0.1,1.6c0,0.2,0,0.3,0,0.4
	c0,0.5-0.1,1-0.2,1.6v0.1c-0.1,0.5-0.2,1.1-0.3,1.6c0,0.1-0.1,0.2-0.1,0.3C125.4,89,115.8,97,104.3,97C90.9,97,80,86.1,80,72.7
	s10.9-24.3,24.3-24.3s23.2,9.8,24.2,22.3c0,0.1,0,0.2,0,0.3C128.6,71.5,128.6,72.1,128.6,72.7L128.6,72.7L128.6,72.7L128.6,72.7z"
        />
      </svg>
    );
  }
);
