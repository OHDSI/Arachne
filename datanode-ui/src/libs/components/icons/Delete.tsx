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

export const Delete: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="delete"
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
            d="M44,65.7v52.4c0,1.5,0.6,2.9,1.6,4c2.2,2.2,5.8,2.2,7.9,0c1.1-1.1,1.6-2.5,1.6-4V65.7c0-3.1-2.5-5.6-5.6-5.6
		S44,62.6,44,65.7z"
          />
          <path
            d="M148.4,31.7c-1.1-1.1-2.6-1.7-4.1-1.6h-28.7V21c0-2.9-1.1-5.8-3.3-7.8c-2-2.1-4.9-3.3-7.8-3.2h-49c-6.1,0-11,4.9-11,11
		c0,0,0,0,0,0v9.1H15.6c-3.1,0-5.6,2.5-5.6,5.6c0,1.5,0.6,2.9,1.6,3.9c1,1.1,2.5,1.7,4,1.7h4.8V139c0,2.9,1.1,5.8,3.3,7.8
		c2,2.1,4.8,3.3,7.8,3.2H130c2.9,0,5.7-1.1,7.8-3.2c2.1-2,3.3-4.8,3.3-7.8V41.2h3.1c1.5,0,3-0.6,4.1-1.7c1.1-1,1.8-2.4,1.8-3.9
		C150,34.2,149.4,32.8,148.4,31.7z M55.4,21.1h49.1v9H55.4L55.4,21.1z M130,139H31.5V41.2H130V139z"
          />
          <path
            d="M109.9,123.8c1.5,0,3-0.6,4-1.7c1.1-1.1,1.7-2.5,1.6-4V65.7c0-1.5-0.6-2.9-1.6-4c-2.2-2.2-5.7-2.2-7.9-0.1c0,0,0,0-0.1,0.1
		c-1.1,1.1-1.7,2.5-1.6,4v52.4c0,1.5,0.6,2.9,1.6,4C107,123.2,108.4,123.8,109.9,123.8z"
          />
          <path
            d="M79.9,123.8c1.5,0,2.9-0.6,3.9-1.7c1.1-1.1,1.7-2.5,1.6-4V65.7c0-1.5-0.6-2.9-1.6-4c-2.1-2.2-5.5-2.2-7.7-0.1
		c0,0-0.1,0.1-0.1,0.1c-1.1,1.1-1.7,2.5-1.6,4v52.4c0,1.5,0.6,2.9,1.6,4C77,123.2,78.4,123.8,79.9,123.8z"
          />
        </g>
      </svg>
    );
  }
);
