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

export const Logout: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="logout"
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
            d="M119.2,127.7c-1.3-0.2-2.6,0.1-3.7,0.9c-10.3,7.6-22.8,11.7-35.5,11.6c-8,0-16-1.5-23.4-4.6c-7.2-3.1-13.6-7.5-19.1-13
       c-5.5-5.5-9.9-12-12.9-19.1C21.4,96,19.8,88,19.8,80c0-8,1.5-16,4.6-23.4c3.1-7.2,7.5-13.6,13-19.1c5.5-5.5,12-9.9,19.1-12.9
       c19.5-8.3,41.9-5.7,58.9,6.8c1,0.8,2.3,1.1,3.6,0.9c1.3-0.2,2.4-0.9,3.2-2c0.8-1,1.2-2.3,1-3.6c-0.2-1.3-0.9-2.5-1.9-3.2
       C109.5,14.6,94.9,9.9,80,10C41.4,9.9,10.1,41.2,10,79.8c0,0.1,0,0.1,0,0.2c-0.1,38.6,31.2,69.9,69.8,70c0.1,0,0.1,0,0.2,0
       c14.9,0.1,29.5-4.6,41.4-13.5c1.1-0.8,1.7-1.9,1.9-3.2c0.2-1.3-0.1-2.6-0.9-3.6C121.7,128.6,120.5,127.8,119.2,127.7z"
          />
          <path
            d="M148.6,76.4L130,58c-0.9-1-2.2-1.5-3.6-1.5c-2.7,0-4.9,2.2-4.9,4.9c0,0,0,0,0,0c0,1.4,0.6,2.7,1.5,3.6l10.1,10.1H67.4
       c-2.7,0-4.9,2.2-4.9,4.9c0,2.7,2.2,4.9,4.9,4.9h65.8l-10.1,10c-1,0.9-1.5,2.2-1.5,3.6c0,2.7,2.2,4.9,4.9,4.9c0,0,0,0,0,0
       c1.3,0,2.6-0.5,3.5-1.5l18.6-18.5C150.4,81.5,150.4,78.5,148.6,76.4L148.6,76.4z"
          />
        </g>
      </svg>
    );
  }
);
