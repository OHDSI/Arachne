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

export const Notification: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="notification"
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
          fillRule="evenodd"
          d="M128.4,117.3H30.3c0.5-0.9,1.6-2.5,3.2-4.7c0.1-0.2,1-1.4,2.7-3.7s2.8-3.8,3.4-4.5s1.5-2.2,2.8-4.4c1.3-2.2,2.3-4,2.8-5.4
	c0.5-1.4,1-3.1,1.6-5.2s0.8-4.1,0.8-5.9V54.8c0-9.9,3.1-18.2,9.3-25.1c6.2-6.9,13.8-10.3,22.8-10.3c2.6,0,5.2,0.3,7.6,1
	s4.7,1.5,6.8,2.7c2.1,1.1,4.1,2.5,6,4.2c1.8,1.6,3.5,3.5,5,5.6c1.5,2,2.8,4.2,3.8,6.5c1,2.3,1.8,4.8,2.4,7.4s0.8,5.4,0.8,8.2v28.6
	c0,2.8,0.4,5.7,1.2,8.6s2.1,5.7,3.7,8.4c1.7,2.7,3.1,4.9,4.3,6.6s2.8,3.8,4.8,6.2c0.3,0.4,0.5,0.6,0.6,0.8s0.3,0.4,0.6,0.8
	c0.3,0.3,0.5,0.6,0.7,0.8s0.4,0.5,0.6,0.8s0.4,0.6,0.6,0.8L128.4,117.3L128.4,117.3z M79.9,140.8c-1.9,0-3.7-0.4-5.4-1.2
	c-1.7-0.8-3.2-1.8-4.5-3s-2.3-2.7-3.1-4.5c-0.8-1.8-1.2-3.6-1.2-5.6H94c0,3.9-1.4,7.3-4.1,10.1S83.8,140.8,79.9,140.8L79.9,140.8z
	 M133.4,107.4c-1.1-1.4-2-2.5-2.7-3.4s-1.6-2.1-2.6-3.6s-1.9-2.8-2.6-4c-0.7-1.2-1.3-2.6-2-4.1s-1.2-3-1.6-4.5
	c-0.4-1.5-0.5-2.9-0.5-4.3V54.8c0-6.1-1.1-11.9-3.2-17.5s-5.1-10.3-8.7-14.2c-3.7-4-8.1-7.1-13.2-9.5S85.5,10,79.8,10
	c-7.6,0-14.6,2-20.9,6s-11.4,9.5-15,16.3s-5.4,14.3-5.4,22.5v28.6c0,1.6-0.2,3.3-0.7,5s-1.3,3.5-2.4,5.5c-1.2,2-2.1,3.4-2.7,4.4
	c-0.6,1-1.8,2.6-3.5,4.9c-1.7,2.3-2.7,3.6-3,3.8l-2.4,3.5c-0.5,0.8-1.2,1.8-1.9,3c-0.7,1.2-1.2,2.2-1.4,3c-0.2,0.8-0.3,1.7-0.3,2.7
	s0.2,2,0.7,2.9c1.5,3,5.3,4.5,11.2,4.5h24.8c0,6.5,2.3,12,6.8,16.6c4.5,4.6,10,6.9,16.4,6.9s11.9-2.3,16.4-6.9
	c4.5-4.6,6.8-10.1,6.8-16.6h25.3c6,0,9.6-1.5,11-4.5c0.4-0.6,0.6-1.3,0.6-2c0.1-0.7,0.1-1.3,0-1.8s-0.2-1.2-0.6-2s-0.7-1.4-0.9-2
	c-0.3-0.6-0.8-1.3-1.4-2.2c-0.7-0.9-1.2-1.6-1.7-2.2S134.2,108.5,133.4,107.4L133.4,107.4z"
        />
      </svg>
    );
  }
);
