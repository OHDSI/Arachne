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

export const Reload: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="reload"
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M141.9,92.2c-0.2,1.5-0.4,3.1-0.6,4.6c-1.2,9.5-4.5,18.2-10,26.1c-9,13.1-21.3,21.8-36.9,25.2
	c-23.1,5.1-43.2-0.9-59.7-17.7c-8.6-8.8-13.7-19.4-15.8-31.4c-1-5.8-1.1-11.6-0.4-17.4c0.4-3.1,3.6-5.6,6.7-5.2c3.6,0.5,6,3.4,5.6,7
	c-2.6,23.1,11.8,44.9,34.2,51.8c6.5,2,13.2,2.7,19.9,2.1c20.9-2.1,38.1-16.8,43.1-37.1c6.2-25.1-8.3-50.5-33.2-58.1
	c-13.8-4.2-27-2.7-39.6,4.3c-0.2,0.1-0.3,0.2-0.5,0.3c0,0-0.1,0.1-0.3,0.2c0.7,0.2,1.3,0.4,1.9,0.5c0.6,0.2,1.2,0.3,1.9,0.5
	c5.3,1.3,10.7,2.7,16.1,4c2.7,0.7,4.4,2.3,5,5.1c0.8,4.1-3.2,7.9-7.2,6.9c-6.5-1.5-13-3.2-19.5-4.9c-6.8-1.7-13.5-3.4-20.3-5.1
	c-0.2,0-0.3-0.1-0.5-0.2c0.6-2.3,1.2-4.6,1.8-6.9c2.8-10.6,5.5-21.3,8.2-31.9c0.8-3.1,2.7-4.9,5.7-5.2c4.1-0.4,7.6,3.4,6.6,7.4
	c-1.4,5.7-2.9,11.4-4.4,17.2c-0.1,0.3-0.2,0.7-0.3,1.1c1.7-0.8,3.3-1.7,5-2.4c6.4-2.9,13.2-4.6,20.2-5.2
	c30.8-2.8,59.1,17.5,65.9,47.4c0.7,3,0.9,6.2,1.4,9.2c0.1,0.3,0.1,0.6,0.2,0.9L141.9,92.2L141.9,92.2z"
        />
      </svg>
    );
  }
);
