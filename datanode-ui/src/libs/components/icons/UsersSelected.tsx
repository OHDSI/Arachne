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

export const UsersSelected: React.FC<any> = React.forwardRef(
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
        <circle fill="#b7fcd9" cx="80" cy="80" r="70" />
        <path
          fill={theme.palette.primary.main || "#A9BAD4"}
          d="M80,10c-38.7,0-70,31.3-70,70s31.3,70,70,70s70-31.3,70-70S118.7,10,80,10z M70,141.7v-38.5
	c0-1.5-1.2-2.7-2.7-2.7h-2.1c-1.5,0-2.7,1.2-2.7,2.7V140c-3.8-1.1-7.5-2.6-11-4.4v-42c0-1.9,1.6-3.5,3.5-3.5h50.1
	c1.9,0,3.5,1.6,3.5,3.5v42c-3.5,1.8-7.2,3.3-11.1,4.4v-36.8c0-1.5-1.2-2.7-2.7-2.7h-2.1c-1.5,0-2.7,1.2-2.7,2.7v38.3
	c0,0.1,0,0.1,0,0.1c-3.3,0.5-6.6,0.8-10.1,0.8S73.3,142.2,70,141.7L70,141.7z M64.2,63.4c0-8.9,7.2-16.1,16.1-16.1
	s16.1,7.2,16.1,16.1s-7.2,16.1-16.1,16.1S64.2,72.3,64.2,63.4z M116.1,130.9V93.5c0-6.1-4.9-11-11-11h-11c5.9-4.3,9.8-11.2,9.8-19.1
	c0-13-10.6-23.6-23.6-23.6S56.7,50.4,56.7,63.4c0,7.8,3.8,14.8,9.8,19.1H55c-6.1,0-11,4.9-11,11V131c-5.4-3.8-10.1-8.4-14.1-13.7
	V82.1c0-1.9,1.6-3.5,3.5-3.5h10.2c2.3-1.8,5.1-3.1,8.1-3.7c-1.3-3.1-2.1-6.4-2.3-9.9c-4-2.9-6.7-7.7-6.7-13
	c0-8.9,7.2-16.1,16.1-16.1c1.8,0,3.5,0.3,5.1,0.8c2.7-1.7,5.6-3,8.8-3.8c-3.9-2.8-8.7-4.5-13.8-4.5c-13,0-23.6,10.6-23.6,23.6
	c0,7.8,3.8,14.8,9.8,19.1H33.4c-6.1,0-11,4.9-11,11v22c-3.1-7.4-4.9-15.6-4.9-24.2c0-34.5,28-62.5,62.5-62.5s62.5,28,62.5,62.5
	c0,8.6-1.7,16.7-4.9,24.2V82.1c0-6.1-4.9-11-11-11h-11c5.9-4.3,9.8-11.2,9.8-19.1c0-13-10.6-23.6-23.6-23.6c-5.2,0-9.9,1.7-13.8,4.5
	c3.2,0.8,6.1,2.1,8.8,3.8c1.6-0.5,3.2-0.8,4.9-0.8c8.9,0,16.1,7.2,16.1,16.1c0,5.3-2.6,10-6.5,12.9c-0.2,3.5-1,6.9-2.4,10.1
	c2.8,0.6,5.4,1.8,7.6,3.6h10c2,0,3.5,1.6,3.5,3.5v35.2C126.2,122.5,121.5,127.1,116.1,130.9L116.1,130.9z"
        />
      </svg>
    );
  }
);
