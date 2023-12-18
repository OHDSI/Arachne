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

export const Add: React.FC<any> = React.forwardRef(
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
        style={{ enableBackground: "new 0 0 160 160" }}
        xmlSpace="preserve"
        {...rest}
      >
        <g>
          <path
            fillRule="evenodd"
            d="M80,10c-38.7,0-70,31.3-70,70s31.3,70,70,70s70-31.3,70-70S118.7,10,80,10z M80,140.5
		c-33.4,0-60.5-27.1-60.5-60.5S46.6,19.5,80,19.5s60.5,27.1,60.5,60.5C140.5,113.4,113.4,140.5,80,140.5z"
          />
          <path
            fillRule="evenodd"
            d="M115.6,75.2H84.8V44.4c0-2.6-2.1-4.8-4.8-4.8s-4.8,2.1-4.8,4.8v30.9H44.4c-2.6,0-4.8,2.1-4.8,4.8
		s2.1,4.8,4.8,4.8h30.9v30.9c0,2.6,2.1,4.8,4.8,4.8s4.8-2.1,4.8-4.8V84.8h30.9c2.6,0,4.8-2.1,4.8-4.8S118.3,75.2,115.6,75.2z"
          />
        </g>
      </svg>
    );
  }
);
