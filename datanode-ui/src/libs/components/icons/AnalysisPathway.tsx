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

import { useTheme } from "@mui/material";
import React from "react";

export const AnalysisPathway: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    const theme = useTheme();
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
          d="M137.7,92c-0.8-4.3-4.2-7.4-8.2-8.2l-1.6-9.1c12.8-4,22-15.9,22-30c0-17.4-14.1-31.5-31.4-31.5S87,27.3,87,44.7
	c0,8.3,3.2,15.9,8.5,21.5L83.3,81.3c-1.6-0.7-3.3-1-5.1-1c-2.2,0-4.3,0.5-6.1,1.4L63,73.2c0.9-1.8,1.4-3.9,1.4-6
	c0-7.6-6.1-13.7-13.7-13.7S37,59.6,37,67.2c0,3.8,1.6,7.3,4.1,9.8L26.9,101c-1-0.2-2.1-0.4-3.2-0.4c-7.6,0-13.7,6.1-13.7,13.7
	s6.1,13.7,13.7,13.7s13.7-6.1,13.7-13.7c0-3.6-1.3-6.8-3.6-9.2l14.5-24.5c0.8,0.2,1.6,0.2,2.5,0.2c2.5,0,4.8-0.7,6.8-1.8l8.7,8.2
	c-1.1,2-1.8,4.3-1.8,6.7c0,7.6,6.1,13.7,13.7,13.7s13.7-6.1,13.7-13.7c0-2.8-0.9-5.5-2.3-7.7l12.2-15.1c4.8,3.1,10.6,4.9,16.8,4.9
	c0.5,0,1,0,1.5,0l1.7,9.5c-3.1,2.2-4.7,6.1-4,10.1l7.5,40.1c0.9,4.9,5.2,8.3,10,8.3c0.6,0,1.3-0.1,1.9-0.2c5.5-1,9.2-6.4,8.1-11.9
	L137.7,92L137.7,92z M23.6,120.1c-3.1,0-5.7-2.6-5.7-5.7s2.5-5.7,5.7-5.7s5.7,2.6,5.7,5.7S26.8,120.1,23.6,120.1z M45.1,67.2
	c0-3.2,2.5-5.7,5.7-5.7s5.7,2.6,5.7,5.7s-2.5,5.7-5.7,5.7S45.1,70.3,45.1,67.2z M78.2,99.7c-3.1,0-5.7-2.6-5.7-5.7s2.5-5.7,5.7-5.7
	s5.7,2.6,5.7,5.7S81.3,99.7,78.2,99.7z M95.1,44.7c0-13,10.5-23.5,23.4-23.5s23.4,10.5,23.4,23.5s-10.5,23.5-23.4,23.5
	S95.1,57.6,95.1,44.7z M135.6,136.1c-0.1,0-0.3,0-0.4,0c-0.9,0-1.9-0.6-2.1-1.8l-7.5-40.1c-0.1-0.7,0.1-1.3,0.3-1.6
	c0.2-0.3,0.7-0.8,1.4-0.9c0.1,0,0.3,0,0.4,0c0.9,0,1.9,0.6,2.1,1.8l7.5,40.1C137.6,134.8,136.8,135.9,135.6,136.1L135.6,136.1z"
        />
      </svg>
    );
  }
);
