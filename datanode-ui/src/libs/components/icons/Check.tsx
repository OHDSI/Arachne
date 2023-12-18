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

export const Check: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="selected-checkbox"
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
          d="M127.6,48.4c0.3,0.6,0.4,1,0.4,1.3s-0.1,0.7-0.4,1.3l-53.9,69.2c-0.9,0.9-1.5,1.3-1.9,1.3
	c-0.7,0-1.4-0.4-2.2-1.1L39.1,91l-0.7-0.7c-0.3-0.6-0.4-1-0.4-1.3c0-0.1,0.1-0.5,0.4-1.1l0.4-0.4c4-4.3,7.2-7.6,9.5-9.9
	c0.9-0.9,1.4-1.3,1.7-1.3c0.6,0,1.3,0.4,2.2,1.3l17.3,16.9l43.3-55.6c0.3-0.3,0.7-0.4,1.3-0.4c0.4,0,0.9,0.1,1.5,0.4L127.6,48.4
	L127.6,48.4z"
        />
      </svg>
    );
  }
);
