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

export const Invitation: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="invitation"
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
          d="M150,37.5c0-6.9-5.6-12.5-12.5-12.5h-115C15.6,25,10,30.6,10,37.5v85c0,6.9,5.6,12.5,12.5,12.5h115
	c6.9,0,12.5-5.6,12.5-12.5V37.5z M140,40.4c0,6.6-6.4,15.3-11.5,19.3c-10.5,8.2-20.9,16.5-31.3,24.8C93.1,87.8,85.6,95,80.1,95h-0.2
	c-5.5,0-13-7.2-17.1-10.6c-10.4-8.3-20.9-16.6-31.3-24.8C24.4,54.1,20,46.4,20,37.5c0-1.3,1.2-2.5,2.5-2.5h115
	C140.5,35,140,38.4,140,40.4z M140,122.5c0,1.3-1.2,2.5-2.5,2.5h-115c-1.3,0-2.5-1.2-2.5-2.5v-60c1.6,1.9,3.4,3.6,5.4,5.2
	C36.6,76.2,47.8,85,58.7,94.1C64.5,99,71.8,105,79.9,105h0.2c8.1,0,15.4-6,21.2-10.9c10.9-9.1,22.1-17.8,33.3-26.4
	c1.9-1.6,3.8-3.3,5.4-5.2V122.5z"
        />
      </svg>
    );
  }
);
