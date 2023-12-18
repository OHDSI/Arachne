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

export const Copy: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="copy"
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
          <path d="M108.4,10H32.2c-3.4,0-6.6,1.3-8.9,3.8c-2.4,2.4-3.7,5.6-3.7,9v89.1h12.5V22.8h76.2V10H108.4z" />
          <path
            d="M136.5,39.3c-2.4-2.4-5.6-3.7-9-3.7H57.8c-3.4,0-6.6,1.3-9,3.7c-2.5,2.3-3.9,5.5-3.8,8.9v89.1c0.1,7,5.8,12.7,12.8,12.8
		h69.7c7-0.1,12.7-5.8,12.8-12.8V48.1C140.4,44.8,139,41.6,136.5,39.3z M127.5,137.2H57.8V48.1h69.7V137.2z"
          />
        </g>
      </svg>
    );
  }
);
