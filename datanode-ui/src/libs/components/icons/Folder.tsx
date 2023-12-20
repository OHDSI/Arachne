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

export const Folder: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="concept-sets"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 160 160"
        style={{ enableBackground: "new 0 0 160 160" }}
        xmlSpace="preserve"
        {...rest}
      >
        {/* <path d="M64.7,33.5h24.1c2.2,0,3.9-1.8,3.9-4s-1.7-4-3.9-4H64.7c-2.2,0-3.9,1.8-3.9,4S62.6,33.5,64.7,33.5z" />
      <path d="M64.7,46.3h24.1c2.2,0,3.9-1.8,3.9-4s-1.7-4-3.9-4H64.7c-2.2,0-3.9,1.8-3.9,4S62.6,46.3,64.7,46.3z" /> */}
        <path
          d="M147.4,77.4c-1.6-1.7-3.9-2.7-6.3-2.7h-33.7V20.5c0-2.9-1.2-5.6-3-7.4c-1.8-1.9-4.4-3.1-7.2-3.1H50.5
	c-2.1,0-4.2,0.9-5.7,2.5L12.4,46.7c-1.1,1.2-1.9,2.7-2.2,4.3c0,0.2-0.1,0.4-0.1,0.6C10,51.9,10,52.3,10,52.7v74.5
	c0,2.8,1.1,5.4,2.9,7.2c1.8,1.9,4.3,3,7.1,3h8.5v1.9c0,2.9,1.2,5.6,3,7.5c1.9,1.9,4.5,3.1,7.3,3.1h101.9c2.6,0,4.9-1.1,6.6-2.8
	c1.7-1.7,2.7-4.1,2.7-6.7V83.9C150,81.3,149,79,147.4,77.4L147.4,77.4z M46.9,49.6H21.2l25.6-27V49.6z M20,129.5
	c-0.6,0-1.1-0.2-1.5-0.7c-0.4-0.4-0.6-1-0.6-1.6V57.6h31.6c1.5,0,2.8-0.6,3.7-1.6c1-1,1.5-2.3,1.5-3.8V18h42.5
	c0.7,0,1.3,0.3,1.8,0.7c0.4,0.5,0.7,1.1,0.7,1.8v54.2h-8.5l-9.7-10l0,0c-1.3-1.4-3.2-2.2-5.1-2.2h0l-35.1,0.2c-3.5,0-6.7,1.5-9,3.9
	c-2.3,2.4-3.7,5.7-3.7,9.3v53.6H20L20,129.5z M142.2,140.5c0,0.4-0.2,0.8-0.4,1.1c-0.3,0.3-0.6,0.4-1.1,0.4H38.8
	c-0.7,0-1.3-0.3-1.8-0.8c-0.5-0.5-0.8-1.1-0.8-1.9V76c0-1.4,0.6-2.7,1.5-3.7c0.9-0.9,2.2-1.5,3.5-1.5l34.9-0.2l9.7,9.9
	c1.4,1.4,3.3,2.2,5.2,2.2h50.1c0.3,0,0.6,0.1,0.8,0.3c0.2,0.2,0.3,0.5,0.3,0.8L142.2,140.5L142.2,140.5z"
        />
        {/* <path d="M128.8,94.5h-81c-2.2,0-3.9,1.8-3.9,4s1.7,4,3.9,4h81c2.1,0,3.9-1.8,3.9-4S131,94.5,128.8,94.5z" /> */}
      </svg>
    );
  }
);
