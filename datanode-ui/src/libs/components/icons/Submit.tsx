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

export const Submit: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="save"
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
          d="M128.5,15.4c-0.7,0-1.5,0.2-2,0.7l-67.3,86.5L32.2,76.3c-1.3-1.3-2.5-2-3.4-2c-0.5,0-1.4,0.7-2.7,2
	c-3.6,3.6-8.5,8.8-14.8,15.5l-0.7,0.7c-0.3,0.5-0.5,1.1-0.7,1.7c0.1,0.7,0.3,1.4,0.7,2l1,1l47.5,45.8c0.8,1,2.1,1.6,3.4,1.7
	c0.7,0,1.7-0.7,3-2l83.8-107.7c0.4-0.6,0.6-1.3,0.7-2c-0.1-0.7-0.3-1.4-0.7-2l-18.5-14.8C130.1,15.7,129.3,15.4,128.5,15.4"
        />
      </svg>
    );
  }
);
