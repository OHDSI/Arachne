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

export const Documents: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="documents"
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
          d="M147.1,35.5c-1.8-1.9-4.4-3.2-7.3-3.2H106V20.5c0-2.9-1.1-5.5-2.9-7.4c-1.8-1.9-4.4-3.1-7.3-3.1H50c-2.2,0-4.3,0.9-5.8,2.5
	l0,0L12.4,46.8c-1.1,1.2-1.9,2.7-2.2,4.3c0,0.2-0.1,0.4-0.1,0.6C10,52,10,52.4,10,52.8v64.6c0,2.8,1.1,5.3,2.9,7.2
	c1.8,1.9,4.3,3.1,7.1,3.1h34v12.1c0,2.8,1.1,5.3,2.9,7.2c1.8,1.9,4.3,3.1,7.1,3.1h75.8c2.9,0,5.5-1.2,7.3-3.1
	c1.8-1.9,2.9-4.5,2.9-7.4V42.9C150,40.1,148.9,37.4,147.1,35.5z M46.2,22.9v26.7H21.3C21.3,49.7,46.2,22.9,46.2,22.9z M20,119.6
	c-0.5,0-1-0.2-1.4-0.6c-0.4-0.4-0.6-1-0.6-1.7V57.6h30.8c1.5,0,2.9-0.7,3.8-1.7c1-1,1.5-2.3,1.5-3.8V18h41.6c0.6,0,1.1,0.2,1.5,0.7
	c0.4,0.5,0.7,1.1,0.7,1.9v11.8h-4c-2.2,0-4.3,0.9-5.8,2.5l0,0L56.3,69.1c-1.1,1.2-1.9,2.7-2.2,4.3c0,0.2-0.1,0.4-0.1,0.6
	c0,0.4-0.1,0.8-0.1,1.2v44.5L20,119.6L20,119.6z M90.2,45.3V72H65.3L90.2,45.3z M142,139.5c0,0.8-0.3,1.4-0.7,1.9
	c-0.4,0.4-1,0.7-1.5,0.7H64c-0.5,0-1-0.2-1.3-0.6c-0.4-0.4-0.6-1-0.6-1.6V80h30.8c1.5,0,2.9-0.7,3.8-1.7c0.9-1,1.5-2.3,1.5-3.8V40.4
	h41.6c0.6,0,1.1,0.2,1.5,0.7c0.4,0.5,0.7,1.1,0.7,1.9L142,139.5L142,139.5z"
        />
        <path d="M132.1,95.2H72c-2.2,0-4,1.8-4,4s1.8,4,4,4h60.1c2.2,0,4-1.8,4-4S134.3,95.2,132.1,95.2z" />
        <path d="M132.1,108.8H72c-2.2,0-4,1.8-4,4s1.8,4,4,4h60.1c2.2,0,4-1.8,4-4S134.3,108.8,132.1,108.8z" />
        <path d="M132.1,122.5H72c-2.2,0-4,1.8-4,4s1.8,4,4,4h60.1c2.2,0,4-1.8,4-4S134.3,122.5,132.1,122.5z" />
      </svg>
    );
  }
);
