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

export const Analysis: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
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
        {/* <style type="text/css">
	.st0{fill:#1D1D1B;}
</style> */}
        <path
          fill="evenodd"
          d="M32.3,87.5c0-2.2-0.5-2.7-2.7-2.8c-4.2,0-8.4,0-12.6,0c-2.1,0-2.7,0.6-2.7,2.8c0,13.1,0,46.7,0,59.7
	c0,2.1,0.6,2.8,2.7,2.8c4.2,0,8.3,0,12.5,0c2.4,0,2.8-0.5,2.8-2.9c0-6.5,0-7.9,0-14.3C32.3,126.2,32.3,94,32.3,87.5L32.3,87.5z"
        />
        <path
          fill="evenodd"
          d="M145.8,64.2c0-2.4-0.5-2.9-3-2.9c-4.1,0-8.1,0-12.2,0c-2.2,0-2.8,0.5-2.8,2.8c0,4.7,0,10.5,0,16.8
	c4.6,6.6,7,14.4,7,22.6c0,6.5-1.6,12.9-4.6,18.6l15.6,15.6c0-5.2,0-9.8,0-16.6C145.8,110.7,145.8,74.6,145.8,64.2L145.8,64.2z"
        />
        <path
          fill="evenodd"
          d="M128.9,149.7l-0.9-0.9C128.1,149.3,128.4,149.6,128.9,149.7z"
        />
        <path
          fill="evenodd"
          d="M58.5,64.2c0-2.4-0.5-2.9-3-2.9c-4.1,0-8.1,0-12.2,0c-2.2,0-2.8,0.5-2.8,2.8c0,20.9,0,62.2,0,83.1
	c0,2.2,0.6,2.8,2.7,2.8c4.1,0,8.2,0,12.3,0c2.5,0,2.9-0.5,2.9-3c0-10.4,0-15.6,0-25.9v-2.7c-1.9-4.7-2.9-9.7-2.9-14.8
	c0-5.2,1-10.2,2.9-14.9C58.5,78.5,58.5,68.8,58.5,64.2L58.5,64.2z"
        />
        <path
          fill="evenodd"
          d="M69.9,147.2c0,2.2,0.6,2.8,2.8,2.8c4.1,0,8.1,0,12.2,0c2.6,0,3-0.5,3-3.1c0-1.7,0-3.1,0-4.5
	c-6.7-1.3-12.8-4.3-18-8.7C69.9,138.9,69.9,143.6,69.9,147.2L69.9,147.2z"
        />
        <path
          fill="evenodd"
          d="M114.5,44.8c-4.1,0-8.2,0-12.3,0c-2.3,0-2.9,0.6-2.9,3c0,3.4,0,9.2,0,16.3c6.5,0.6,12.7,2.8,18,6.4
	c0-11.1,0-20.1,0-22.8C117.3,45.4,116.7,44.8,114.5,44.8L114.5,44.8z"
        />
        <path
          fill="evenodd"
          d="M116.4,137.1c-5.2,3.2-11,5.2-17.1,5.9c0,1.6,0,3.1,0,4.2c0,2.2,0.6,2.8,2.8,2.8c4.1,0,8.1,0,12.2,0
	c2.6,0,3-0.5,3-3.1c0-3.8,0-6.4,0-8.9L116.4,137.1L116.4,137.1z"
        />
        <path
          fill="evenodd"
          d="M122.5,123c3.9-5.5,6.2-12.2,6.2-19.5c0-9.2-3.8-17.7-9.8-23.7c-6.1-6.1-14.5-9.8-23.7-9.8
	c-9.2,0-17.7,3.8-23.7,9.8c-6.1,6.1-9.8,14.5-9.8,23.7s3.8,17.7,9.8,23.7c6.1,6.1,14.5,9.8,23.7,9.8c8.3,0,15.9-3,21.7-8l19.1,19.1
	c1.6,1.6,4.2,1.6,5.8,0s1.6-4.2,0-5.8L122.5,123L122.5,123z M113.1,121.4c-4.6,4.6-10.9,7.4-17.9,7.4c-7,0-13.3-2.8-17.9-7.4
	c-4.6-4.6-7.4-10.9-7.4-17.9c0-7,2.8-13.3,7.4-17.9c4.6-4.6,10.9-7.4,17.9-7.4c7,0,13.3,2.8,17.9,7.4c4.6,4.6,7.4,10.9,7.4,17.9
	C120.5,110.5,117.7,116.8,113.1,121.4z"
        />
        <path
          fill="evenodd"
          d="M23.3,68c4.8,0,8.7-3.9,8.7-8.7c0-0.9-0.1-1.8-0.4-2.6l13.3-10.3c1.3,0.7,2.7,1.1,4.3,1.1
	c2.2,0,4.2-0.8,5.8-2.2l15.2,8c0,0.1,0,0.2,0,0.3c0,4.8,3.9,8.7,8.7,8.7s8.7-3.9,8.7-8.7c0-1.4-0.3-2.8-1-4L104.8,27
	c0.8,0.3,1.8,0.4,2.7,0.4c1.8,0,3.6-0.6,5-1.6l15.8,10.8c-0.2,0.7-0.3,1.4-0.3,2.1c0,4.8,3.9,8.7,8.7,8.7s8.7-3.9,8.7-8.7
	s-3.9-8.7-8.7-8.7c-1.9,0-3.6,0.6-5,1.6L116,20.8c0.2-0.7,0.3-1.4,0.3-2.1c0-4.8-3.9-8.7-8.7-8.7s-8.7,3.9-8.7,8.7
	c0,1.6,0.4,3.1,1.2,4.4L82.1,45.5c-1-0.4-2.1-0.6-3.2-0.6c-2.5,0-4.7,1-6.3,2.7l-14.7-7.7c0-0.3,0.1-0.7,0.1-1.1
	c0-4.8-3.9-8.7-8.7-8.7s-8.7,3.9-8.7,8.7c0,1,0.2,2,0.5,2.8L27.8,51.8c-1.3-0.8-2.9-1.3-4.6-1.3c-4.8,0-8.7,3.9-8.7,8.7
	S18.4,68,23.3,68L23.3,68z"
        />
      </svg>
    );
  }
);
