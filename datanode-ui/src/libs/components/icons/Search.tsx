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

export const Search: React.FC<any> = React.forwardRef(
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
        <path
          fill="evenodd"
          d="M148.7,142.4l-34.8-34.8c21.3-24.8,18.5-62.1-6.3-83.4S45.5,5.7,24.2,30.5s-18.5,62.1,6.3,83.4
   c22.2,19.1,54.9,19.1,77.1,0l34.8,34.8c1.7,1.8,4.5,1.9,6.3,0.2s1.9-4.5,0.2-6.3C148.8,142.5,148.8,142.5,148.7,142.4L148.7,142.4z
	M33.6,104.6C14,85,14,53.2,33.6,33.6s51.4-19.6,71,0c19.5,19.5,19.6,51.1,0.2,70.8l-0.2,0.2l-0.2,0.2
   C84.7,124.2,53.1,124.1,33.6,104.6L33.6,104.6z"
        />
      </svg>
    );
  }
);
