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

export const Close: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="close"
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
          d="M86.3,80l62.4-62.4c1.8-1.7,1.9-4.5,0.2-6.3s-4.5-1.9-6.3-0.2c-0.1,0.1-0.1,0.1-0.2,0.2L80,73.7L17.6,11.3
	c-1.8-1.7-4.6-1.6-6.3,0.2c-1.6,1.7-1.6,4.4,0,6.1L73.7,80l-62.4,62.4c-1.8,1.7-1.9,4.5-0.2,6.3c1.7,1.8,4.5,1.9,6.3,0.2
	c0.1-0.1,0.1-0.1,0.2-0.2L80,86.3l62.4,62.4c1.7,1.8,4.5,1.9,6.3,0.2s1.9-4.5,0.2-6.3c-0.1-0.1-0.1-0.1-0.2-0.2L86.3,80z"
        />
      </svg>
    );
  }
);
