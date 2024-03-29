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

export const Pdf: React.FC<any> = React.forwardRef(
  ({ plain, iconStatus, ...rest }, ref) => {
    const theme: any = useTheme();

    return (
      <svg
        ref={ref}
        version="1.1"
        id="pdf"
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
          d="M27.6,58.1v82c0,2.7,0.9,5.1,2.8,7c1.9,1.9,4.2,2.9,6.9,2.9h85.2c2.7,0,5.1-1,7-2.9c2-1.9,2.9-4.2,2.9-7V19.8
	c0-2.7-1-5.1-2.9-7c-2-1.9-4.3-2.9-7-2.9H75.3c-1.4,0-2.7,0.3-4,0.8c-0.2,0.1-0.3,0.2-0.4,0.3c-0.1,0-0.3,0.1-0.6,0.3
	c-0.7,0.5-1.4,1-2.1,1.5l-38,38.4C28.5,53.1,27.6,55.4,27.6,58.1z M37.4,62.5h32.7c2.7,0,5.1-1,7-2.9s2.9-4.2,2.9-7V19.8h42.5v120.3
	H37.4V62.5L37.4,62.5z M70.2,52.7H42.7L70.2,25V52.7z"
        />
        <path
          d="M101.3,101.4h-0.9c-0.7,0-5.2,0.3-11.6,1.4c-2.5-2.3-4.6-5-6.3-8.1c0.2-0.7,0.4-1.4,0.7-2.1
	c0.4-1.5,1.9-8,1.9-13.4c0-4.7-3.8-8.5-8.5-8.5s-8.5,3.8-8.5,8.5c0,0.1,0,7.3,3.5,15.9c-1.8,4.9-4,9.9-6.5,14.8
	c-5.5,2.6-10,5.7-13.5,9.2c-1.6,1.6-2.4,3.8-2.4,6.3c0,4.7,3.8,8.5,8.5,8.5c2.8,0,5.3-1.3,6.9-3.6c1.9-2.6,4.7-6.8,7.8-12.5
	c4-1.6,8.6-3,13.7-4.1c3.4,2.4,7.4,4.4,11.6,5.8c1.2,0.4,2.4,0.6,3.7,0.6c5.2,0,9.2-4.1,9.2-9.4S106.5,101.4,101.3,101.4
	L101.3,101.4z M59.2,126.3c-0.8,1.2-3.1,0.7-3.1-1.3c0-0.4,0.2-0.9,0.4-1.2c2.3-2.3,5.1-4.3,8.1-6C62.2,121.9,60.2,124.9,59.2,126.3
	L59.2,126.3z M76.6,77.5c0.9,0,1.7,0.8,1.7,1.7c0,3.9-1.1,8.9-1.5,10.7c-1.9-5.8-1.9-10.3-1.9-10.7C74.9,78.3,75.6,77.5,76.6,77.5
	L76.6,77.5z M72.4,110.5c1.7-3.4,3.4-7.2,4.9-11.4c1.6,2.8,3.7,5.6,6.4,8.1C80.1,108.1,76.3,109.1,72.4,110.5L72.4,110.5z
	 M101.5,113.4c-0.5,0-1-0.1-1.5-0.2c-3.1-1.1-5.9-2.4-8.3-3.9c5.2-0.8,8.7-1,8.7-1h0.8c1.4,0,2.6,1.2,2.6,2.8
	C103.9,112.3,102.8,113.4,101.5,113.4z"
        />
        {iconStatus && (
          <>
            <path
              id="shield"
              fill={theme.palette[iconStatus || "primary"]?.main}
              d="M126.1,69.9c1.1,0.6,2.4,0.6,3.4,0C158,54.6,160,24.7,160,16.2c0-1.4-0.8-2.7-2.1-3.2L129.2,0.3
        c-0.9-0.4-2-0.4-2.9,0L97.9,13c-1.3,0.6-2.1,1.8-2.1,3.2C95.7,24.6,97.4,54.6,126.1,69.9L126.1,69.9z M116.1,29.2l8.2,8.2L139.5,22
        l5,5l-20.3,20.3L111,34.2C111,34.2,116.1,29.2,116.1,29.2z"
            />
            <polygon
              id="checked"
              fill="#ffffff"
              points="116.1,29.2 124.2,37.3 139.5,22 144.5,27.1 124.2,47.4 111,34.2 "
            />
          </>
        )}
      </svg>
    );
  }
);

export const Txt: React.FC<any> = React.forwardRef(
  ({ plain, iconStatus, ...rest }, ref) => {
    const theme: any = useTheme();

    return (
      <svg
        ref={ref}
        version="1.1"
        id="txt"
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
          d="M27.6,59.2v82c0,2.7,0.9,5.1,2.8,7c1.9,1.9,4.2,2.9,6.9,2.9h85.2c2.7,0,5.1-1,7-2.9c2-1.9,2.9-4.2,2.9-7V20.9
	c0-2.7-1-5.1-2.9-7c-2-1.9-4.3-2.9-7-2.9H75.3c-1.4,0-2.7,0.3-4,0.8C71.1,12,71,12,70.9,12.1c-0.1,0-0.3,0.1-0.6,0.3
	c-0.7,0.5-1.4,1-2.1,1.5l-38,38.4C28.5,54.2,27.6,56.4,27.6,59.2z M37.4,63.6h32.7c2.7,0,5.1-1,7-2.9s2.9-4.2,2.9-7V20.9h42.5v120.3
	H37.4V63.6L37.4,63.6z M70.2,53.7H42.7l27.5-27.6V53.7z"
        />
        <g>
          <path
            className="st0"
            d="M44.9,94.8h22.4v5.9h-7.5v18h-7.4v-18h-7.5V94.8z"
          />
          <path
            className="st0"
            d="M68.4,94.8h8.1l4.2,7.3l4.1-7.3h8l-7.4,11.6l8.1,12.3h-8.3l-4.7-7.7l-4.7,7.7h-8.2l8.2-12.4
		C75.9,106.2,68.4,94.8,68.4,94.8z"
          />
          <path
            className="st0"
            d="M93.6,94.8H116v5.9h-7.5v18h-7.4v-18h-7.5C93.6,100.7,93.6,94.8,93.6,94.8z"
          />
        </g>
        {iconStatus && (
          <>
            <path
              id="shield"
              fill={theme.palette[iconStatus || "primary"].main}
              d="M126.1,69.9c1.1,0.6,2.4,0.6,3.4,0C158,54.6,160,24.7,160,16.2c0-1.4-0.8-2.7-2.1-3.2L129.2,0.3
        c-0.9-0.4-2-0.4-2.9,0L97.9,13c-1.3,0.6-2.1,1.8-2.1,3.2C95.7,24.6,97.4,54.6,126.1,69.9L126.1,69.9z M116.1,29.2l8.2,8.2L139.5,22
        l5,5l-20.3,20.3L111,34.2C111,34.2,116.1,29.2,116.1,29.2z"
            />
            <polygon
              id="checked"
              fill="#ffffff"
              points="116.1,29.2 124.2,37.3 139.5,22 144.5,27.1 124.2,47.4 111,34.2 "
            />
          </>
        )}
      </svg>
    );
  }
);

export const Doc: React.FC<any> = React.forwardRef(
  ({ plain, iconStatus, ...rest }, ref) => {
    const theme: any = useTheme();

    return (
      <svg
        ref={ref}
        version="1.1"
        id="doc"
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
          d="M27.6,59.2v82c0,2.7,0.9,5.1,2.8,7c1.9,1.9,4.2,2.9,6.9,2.9h85.2c2.7,0,5.1-1,7-2.9c2-1.9,2.9-4.2,2.9-7V20.9
	c0-2.7-1-5.1-2.9-7c-2-1.9-4.3-2.9-7-2.9H75.3c-1.4,0-2.7,0.3-4,0.8C71.1,12,71,12,70.9,12.1c-0.1,0-0.3,0.1-0.6,0.3
	c-0.7,0.5-1.4,1-2.1,1.5l-38,38.4C28.5,54.2,27.6,56.4,27.6,59.2z M37.4,63.6h32.7c2.7,0,5.1-1,7-2.9s2.9-4.2,2.9-7V20.9h42.5v120.3
	H37.4V63.6L37.4,63.6z M70.2,53.7H42.7l27.5-27.6V53.7z"
        />
        <path
          d="M55,84.6h10.5l3.8,20l5.5-20h10.4l5.5,19.9l3.8-19.9H105l-7.9,35.7H86.3L80,97.8l-6.2,22.5H63L55,84.6L55,84.6z
	"
        />
        {iconStatus && (
          <>
            <path
              id="shield"
              fill={theme.palette[iconStatus || "primary"].main}
              d="M126.1,69.9c1.1,0.6,2.4,0.6,3.4,0C158,54.6,160,24.7,160,16.2c0-1.4-0.8-2.7-2.1-3.2L129.2,0.3
        c-0.9-0.4-2-0.4-2.9,0L97.9,13c-1.3,0.6-2.1,1.8-2.1,3.2C95.7,24.6,97.4,54.6,126.1,69.9L126.1,69.9z M116.1,29.2l8.2,8.2L139.5,22
        l5,5l-20.3,20.3L111,34.2C111,34.2,116.1,29.2,116.1,29.2z"
            />
            <polygon
              id="checked"
              fill="#ffffff"
              points="116.1,29.2 124.2,37.3 139.5,22 144.5,27.1 124.2,47.4 111,34.2 "
            />
          </>
        )}
      </svg>
    );
  }
);

export const Unknown: React.FC<any> = React.forwardRef(
  ({ plain, iconStatus, ...rest }, ref) => {
    const theme: any = useTheme();

    return (
      <svg
        ref={ref}
        version="1.1"
        id="doc"
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
          d="M27.6,59.2v82c0,2.7,0.9,5.1,2.8,7c1.9,1.9,4.2,2.9,6.9,2.9h85.2c2.7,0,5.1-1,7-2.9c2-1.9,2.9-4.2,2.9-7V20.9
	c0-2.7-1-5.1-2.9-7c-2-1.9-4.3-2.9-7-2.9H75.3c-1.4,0-2.7,0.3-4,0.8C71.1,12,71,12,70.9,12.1c-0.1,0-0.3,0.1-0.6,0.3
	c-0.7,0.5-1.4,1-2.1,1.5l-38,38.4C28.5,54.2,27.6,56.4,27.6,59.2z M37.4,63.6h32.7c2.7,0,5.1-1,7-2.9s2.9-4.2,2.9-7V20.9h42.5v120.3
	H37.4V63.6L37.4,63.6z M70.2,53.7H42.7l27.5-27.6V53.7z"
        />
        {/* <path
          d="M55,84.6h10.5l3.8,20l5.5-20h10.4l5.5,19.9l3.8-19.9H105l-7.9,35.7H86.3L80,97.8l-6.2,22.5H63L55,84.6L55,84.6z
	"
        /> */}
        {iconStatus && (
          <>
            <path
              id="shield"
              fill={theme.palette[iconStatus || "primary"].main}
              d="M126.1,69.9c1.1,0.6,2.4,0.6,3.4,0C158,54.6,160,24.7,160,16.2c0-1.4-0.8-2.7-2.1-3.2L129.2,0.3
        c-0.9-0.4-2-0.4-2.9,0L97.9,13c-1.3,0.6-2.1,1.8-2.1,3.2C95.7,24.6,97.4,54.6,126.1,69.9L126.1,69.9z M116.1,29.2l8.2,8.2L139.5,22
        l5,5l-20.3,20.3L111,34.2C111,34.2,116.1,29.2,116.1,29.2z"
            />
            <polygon
              id="checked"
              fill="#ffffff"
              points="116.1,29.2 124.2,37.3 139.5,22 144.5,27.1 124.2,47.4 111,34.2 "
            />
          </>
        )}
      </svg>
    );
  }
);

export const Xls: React.FC<any> = React.forwardRef(
  ({ plain, iconStatus, ...rest }, ref) => {
    const theme: any = useTheme();

    return (
      <svg
        ref={ref}
        version="1.1"
        id="excel"
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
          d="M27.6,59.2v82c0,2.7,0.9,5.1,2.8,7c1.9,1.9,4.2,2.9,6.9,2.9h85.2c2.7,0,5.1-1,7-2.9c2-1.9,2.9-4.2,2.9-7V20.9
	c0-2.7-1-5.1-2.9-7c-2-1.9-4.3-2.9-7-2.9H75.3c-1.4,0-2.7,0.3-4,0.8C71.2,12,71,12,70.9,12.1c-0.1,0-0.3,0.1-0.6,0.3
	c-0.7,0.5-1.4,1-2.1,1.5l-38,38.4C28.5,54.2,27.6,56.4,27.6,59.2L27.6,59.2z M37.4,63.6h32.7c2.7,0,5.1-1,7-2.9s2.9-4.2,2.9-7V20.9
	h42.5v120.3H37.4L37.4,63.6L37.4,63.6z M70.2,53.7H42.7l27.5-27.6V53.7z"
        />
        <path
          d="M61.8,84.7h12.1l6.3,11l6.2-11h12L87.3,102l12.2,18.4H87.1L80,108.9L73,120.4H60.7L73,101.8L61.8,84.7
	L61.8,84.7z"
        />
        {iconStatus && (
          <>
            <path
              id="shield"
              fill={theme.palette[iconStatus || "primary"].main}
              d="M126.1,69.9c1.1,0.6,2.4,0.6,3.4,0C158,54.6,160,24.7,160,16.2c0-1.4-0.8-2.7-2.1-3.2L129.2,0.3
        c-0.9-0.4-2-0.4-2.9,0L97.9,13c-1.3,0.6-2.1,1.8-2.1,3.2C95.7,24.6,97.4,54.6,126.1,69.9L126.1,69.9z M116.1,29.2l8.2,8.2L139.5,22
        l5,5l-20.3,20.3L111,34.2C111,34.2,116.1,29.2,116.1,29.2z"
            />
            <polygon
              id="checked"
              fill="#ffffff"
              points="116.1,29.2 124.2,37.3 139.5,22 144.5,27.1 124.2,47.4 111,34.2 "
            />
          </>
        )}
      </svg>
    );
  }
);

export const Json: React.FC<any> = React.forwardRef(
  ({ plain, iconStatus, ...rest }, ref) => {
    const theme: any = useTheme();

    return (
      <svg
        ref={ref}
        version="1.1"
        id="code"
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
          d="M27.6,59.2v82c0,2.7,0.9,5.1,2.8,7c1.9,1.9,4.2,2.9,6.9,2.9h85.2c2.7,0,5.1-1,7-2.9c2-1.9,2.9-4.2,2.9-7V20.9
	c0-2.7-1-5.1-2.9-7c-2-1.9-4.3-2.9-7-2.9H75.3c-1.4,0-2.7,0.3-4,0.8C71.1,12,71,12,70.9,12.1c-0.1,0-0.3,0.1-0.6,0.3
	c-0.7,0.5-1.4,1-2.1,1.5l-38,38.4C28.5,54.2,27.6,56.4,27.6,59.2z M37.4,63.6h32.7c2.7,0,5.1-1,7-2.9s2.9-4.2,2.9-7V20.9h42.5v120.3
	H37.4V63.6L37.4,63.6z M70.2,53.7H42.7l27.5-27.6V53.7z"
        />
        <g>
          <path
            d="M60.6,90.6v6.1h-0.8c-0.8,0-1.4,0.2-1.7,0.5c-0.4,0.3-0.7,0.8-0.8,1.5c-0.1,0.4-0.1,1.4-0.2,3.1
		c0,1.7-0.2,3-0.5,3.9c-0.2,0.7-0.6,1.3-1.1,1.8c-0.3,0.3-0.9,0.7-1.7,1c0.8,0.4,1.4,0.8,1.8,1.2c0.4,0.4,0.7,1,1,1.9
		c0.3,0.8,0.4,2.2,0.4,4.1c0,1.7,0.1,2.8,0.3,3.3s0.5,0.9,0.9,1.1s1.2,0.3,2.4,0.3v6h-2.3c-2.4,0-4.1-0.3-5.1-0.8
		c-1-0.5-1.7-1.3-2.2-2.3c-0.4-1-0.7-2.5-0.7-4.5c0-0.4,0-0.9,0-1.3c0-0.3,0-0.6,0-0.8c0-1.4-0.1-2.4-0.4-3.1s-0.6-1-1.1-1.3
		s-1.2-0.4-2.1-0.4v-6.4c1,0,1.7-0.2,2.1-0.4c0.5-0.3,0.8-0.8,1.1-1.4c0.2-0.6,0.4-1.7,0.4-3.1v-0.6c0-0.3,0-0.6,0-0.8
		c0-2.2,0.2-3.8,0.5-4.8s0.9-1.7,1.5-2.2c0.5-0.4,1.1-0.7,2-0.9c1.1-0.3,2.3-0.4,3.8-0.4L60.6,90.6L60.6,90.6z"
          />
          <path d="M63.3,110.7h8.1v7.6h-8.1V110.7z" />
          <path d="M76,110.7H84v7.6H76V110.7z" />
          <path d="M88.6,110.7h8.1v7.6h-8.1V110.7z" />
          <path
            d="M101.9,90.6c1.4,0,2.7,0.1,3.8,0.4c0.8,0.2,1.5,0.5,2,0.9c0.6,0.5,1.2,1.3,1.5,2.2c0.4,1,0.6,2.6,0.6,4.8
		c0,0.3,0,0.6,0,0.8v0.6c0,1.5,0.1,2.5,0.4,3.1s0.6,1.1,1.1,1.4c0.5,0.3,1.2,0.4,2.1,0.4v6.4c-0.9,0-1.6,0.2-2.1,0.4
		s-0.9,0.7-1.1,1.3s-0.4,1.6-0.4,3.1c0,0.3,0,0.6,0,0.8c0,0.4,0,0.9,0,1.3c0,2-0.2,3.5-0.7,4.5s-1.2,1.8-2.2,2.3
		c-1,0.5-2.7,0.8-5.1,0.8h-2.3v-6c1.2,0,2-0.1,2.4-0.3s0.7-0.6,0.9-1.1s0.3-1.6,0.3-3.3c0-1.8,0.1-3.2,0.4-4.1s0.6-1.5,1-1.9
		c0.4-0.4,1-0.8,1.8-1.2c-0.8-0.3-1.4-0.7-1.7-1c-0.5-0.4-0.8-1-1.1-1.8c-0.3-0.9-0.5-2.3-0.5-3.9c0-1.7-0.1-2.7-0.2-3.1
		c-0.2-0.7-0.4-1.2-0.8-1.5s-1-0.5-1.7-0.5h-0.8v-6.1L101.9,90.6L101.9,90.6z"
          />
        </g>
        {iconStatus && (
          <>
            <path
              id="shield"
              fill={theme.palette[iconStatus || "primary"].main}
              d="M126.1,69.9c1.1,0.6,2.4,0.6,3.4,0C158,54.6,160,24.7,160,16.2c0-1.4-0.8-2.7-2.1-3.2L129.2,0.3
        c-0.9-0.4-2-0.4-2.9,0L97.9,13c-1.3,0.6-2.1,1.8-2.1,3.2C95.7,24.6,97.4,54.6,126.1,69.9L126.1,69.9z M116.1,29.2l8.2,8.2L139.5,22
        l5,5l-20.3,20.3L111,34.2C111,34.2,116.1,29.2,116.1,29.2z"
            />
            <polygon
              id="checked"
              fill="#ffffff"
              points="116.1,29.2 124.2,37.3 139.5,22 144.5,27.1 124.2,47.4 111,34.2 "
            />
          </>
        )}
      </svg>
    );
  }
);

export const R: React.FC<any> = React.forwardRef(
  ({ plain, iconStatus, ...rest }, ref) => {
    const theme: any = useTheme();

    return (
      <svg
        ref={ref}
        version="1.1"
        id="code"
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
          d="M62.5,118.1V82.4h18.4c3.4,0,6,0.3,7.8,0.9c1.8,0.6,3.2,1.7,4.4,3.2c1.1,1.6,1.7,3.5,1.7,5.8
	c0,2-0.4,3.7-1.3,5.1c-0.8,1.4-2,2.6-3.5,3.5c-0.9,0.6-2.2,1-3.9,1.4c1.3,0.4,2.3,0.9,2.9,1.3c0.4,0.3,1,0.9,1.8,1.9
	c0.8,1,1.3,1.7,1.5,2.2l5.3,10.3H85.1l-5.9-10.9c-0.8-1.4-1.4-2.3-2-2.8c-0.8-0.6-1.7-0.8-2.7-0.8h-1v14.5L62.5,118.1L62.5,118.1z
	 M73.5,96.9h4.7c0.5,0,1.5-0.2,2.9-0.5c0.7-0.2,1.3-0.5,1.8-1.1c0.5-0.6,0.7-1.3,0.7-2.1c0-1.2-0.4-2-1.1-2.7
	c-0.7-0.6-2.1-0.9-4.1-0.9h-4.8V96.9z"
        />
        <g>
          <path
            d="M129.5,12.9c-2-1.9-4.3-2.9-7-2.9H75.3c-1.4,0-2.7,0.3-4,0.8c-0.2,0.1-0.3,0.2-0.4,0.3c-0.1,0-0.3,0.1-0.6,0.3
		c-0.7,0.5-1.4,1-2.1,1.5l-38,38.4c-1.8,1.8-2.7,4.1-2.7,6.8v82c0,2.7,0.9,5.1,2.8,7c1.9,1.9,4.2,2.9,6.9,2.9h85.2
		c2.7,0,5.1-1,7-2.9c2-1.9,2.9-4.2,2.9-7V19.8C132.4,17.1,131.4,14.8,129.5,12.9L129.5,12.9z M70.2,25v27.6H42.7
		C42.7,52.7,70.2,25,70.2,25z M122.6,140.2H37.4V62.5h32.7c2.7,0,5.1-1,7-2.9s2.9-4.2,2.9-7V19.8h42.5L122.6,140.2L122.6,140.2z"
          />
        </g>
        {iconStatus && (
          <>
            <path
              id="shield"
              fill={theme.palette[iconStatus || "primary"].main}
              d="M126.1,69.9c1.1,0.6,2.4,0.6,3.4,0C158,54.6,160,24.7,160,16.2c0-1.4-0.8-2.7-2.1-3.2L129.2,0.3
        c-0.9-0.4-2-0.4-2.9,0L97.9,13c-1.3,0.6-2.1,1.8-2.1,3.2C95.7,24.6,97.4,54.6,126.1,69.9L126.1,69.9z M116.1,29.2l8.2,8.2L139.5,22
        l5,5l-20.3,20.3L111,34.2C111,34.2,116.1,29.2,116.1,29.2z"
            />
            <polygon
              id="checked"
              fill="#ffffff"
              points="116.1,29.2 124.2,37.3 139.5,22 144.5,27.1 124.2,47.4 111,34.2 "
            />
          </>
        )}
      </svg>
    );
  }
);

export const SQL: React.FC<any> = React.forwardRef(
  ({ plain, iconStatus, ...rest }, ref) => {
    const theme: any = useTheme();

    return (
      <svg
        ref={ref}
        version="1.1"
        id="code"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 160 160"
        style={{ enableBackground: "new 0 0 160 160" }}
        xmlSpace="preserve"
        {...rest}
      >
        <g id="extention">
          <path
            d="M62.4,104c-1.4-0.7-3.7-1.4-6.9-2.1c-1.3-0.3-2.1-0.6-2.5-0.9c-0.4-0.3-0.5-0.7-0.5-1c0-0.5,0.2-1,0.7-1.3
		s1.1-0.5,1.9-0.5c1,0,1.9,0.2,2.5,0.7c0.6,0.5,1,1.3,1.2,2.3l7-0.4c-0.3-2.5-1.3-4.3-2.9-5.4s-3.9-1.7-7-1.7
		c-2.5,0-4.4,0.3-5.9,0.9c-1.4,0.6-2.5,1.5-3.2,2.6c-0.7,1.1-1.1,2.2-1.1,3.5c0,1.9,0.7,3.4,2.1,4.6c1.4,1.2,3.7,2.2,6.9,2.9
		c2,0.4,3.2,0.9,3.8,1.4s0.8,1,0.8,1.7c0,0.7-0.3,1.2-0.9,1.7c-0.6,0.5-1.4,0.7-2.4,0.7c-1.4,0-2.5-0.5-3.2-1.4
		c-0.5-0.6-0.8-1.5-0.9-2.6l-7,0.4c0.2,2.4,1.1,4.4,2.7,5.9s4.4,2.3,8.4,2.3c2.3,0,4.2-0.3,5.7-1c1.5-0.7,2.7-1.7,3.5-2.9
		s1.3-2.7,1.3-4.2c0-1.3-0.3-2.5-0.9-3.5C64.8,105.5,63.8,104.7,62.4,104L62.4,104z"
          />
          <path
            d="M68.5,106.1c0,4,1.2,7.2,3.7,9.4c2.1,1.9,4.9,2.8,8.6,2.8c2.4,0,4.5-0.3,6.1-1.1c0.4,0.3,1.1,0.9,2.1,1.6
		s2,1.3,3.1,1.8l2.1-4.1c-0.7-0.3-1.3-0.6-1.7-0.8c-0.3-0.2-0.9-0.6-1.8-1.2c1.7-2.1,2.6-4.9,2.6-8.5c0-4-1.1-7-3.2-9.1
		s-5.2-3.2-9.2-3.2s-6.9,1.1-9.1,3.3S68.5,102.1,68.5,106.1L68.5,106.1z M77.2,100.8c0.9-1.1,2.1-1.6,3.6-1.6c1.6,0,2.8,0.5,3.7,1.5
		s1.3,2.8,1.3,5.2c0,2.1-0.3,3.7-0.9,4.7c-0.3-0.2-0.6-0.4-0.8-0.5c-1.1-0.7-1.8-1.2-2.1-1.4c-0.4-0.2-0.9-0.3-1.5-0.4l-1.2,2.7
		c1.3,0.5,2.3,1.1,2.9,1.7c-0.4,0.1-0.9,0.2-1.4,0.2c-1.6,0-2.8-0.5-3.7-1.6s-1.3-2.9-1.3-5.5C75.9,103.5,76.3,101.9,77.2,100.8
		L77.2,100.8z"
          />
          <polygon points="115.4,112 103.9,112 103.9,94.1 96.5,94.1 96.5,117.9 115.4,117.9 	" />
          <path
            d="M129.5,12.9c-2-1.9-4.3-2.9-7-2.9H75.3c-1.4,0-2.7,0.3-4,0.8c-0.2,0.1-0.3,0.2-0.4,0.3c-0.1,0-0.3,0.1-0.6,0.3
		c-0.7,0.5-1.4,1-2.1,1.5l-38,38.4c-1.8,1.8-2.7,4.1-2.7,6.8v82c0,2.7,0.9,5.1,2.8,7c1.9,1.9,4.2,2.9,6.9,2.9h85.2
		c2.7,0,5.1-1,7-2.9c2-1.9,2.9-4.2,2.9-7V19.8C132.4,17.1,131.4,14.8,129.5,12.9L129.5,12.9z M70.2,25v27.6H42.7
		C42.7,52.7,70.2,25,70.2,25z M122.6,140.2H37.4V62.5h32.7c2.7,0,5.1-1,7-2.9s2.9-4.2,2.9-7V19.8h42.5L122.6,140.2L122.6,140.2z"
          />
        </g>
        {iconStatus && (
          <>
            <path
              id="shield"
              fill={theme.palette[iconStatus || "primary"].main}
              d="M126.1,69.9c1.1,0.6,2.4,0.6,3.4,0C158,54.6,160,24.7,160,16.2c0-1.4-0.8-2.7-2.1-3.2L129.2,0.3
        c-0.9-0.4-2-0.4-2.9,0L97.9,13c-1.3,0.6-2.1,1.8-2.1,3.2C95.7,24.6,97.4,54.6,126.1,69.9L126.1,69.9z M116.1,29.2l8.2,8.2L139.5,22
        l5,5l-20.3,20.3L111,34.2C111,34.2,116.1,29.2,116.1,29.2z"
            />
            <polygon
              id="checked"
              fill="#ffffff"
              points="116.1,29.2 124.2,37.3 139.5,22 144.5,27.1 124.2,47.4 111,34.2 "
            />
          </>
        )}
      </svg>
    );
  }
);

export const ZIP: React.FC<any> = React.forwardRef(
  ({ plain, iconStatus, ...rest }, ref) => {
    const theme: any = useTheme();

    return (
      <svg
        ref={ref}
        version="1.1"
        id="code"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 160 160"
        style={{ enableBackground: "new 0 0 160 160" }}
        xmlSpace="preserve"
        {...rest}
      >
        <g id="extention">
          <polygon
            points="73.2,98.5 73.2,93.8 52.4,93.8 52.4,98.9 64.4,98.9 51.1,112.7 51.1,117.6 73.7,117.6 73.7,112.5 
		59.9,112.5 	"
          />
          <rect x="76.7" y="93.8" width="7.4" height="23.8" />
          <path
            d="M96.1,108.8h4c3,0,5.2-0.7,6.6-2c1.4-1.4,2.2-3.2,2.2-5.6s-0.7-4.2-2-5.4c-1.3-1.3-3.3-1.9-6-1.9H88.7v23.8
		h7.4V108.8z M96.1,98.6h2.1c1.4,0,2.3,0.3,2.8,0.8s0.8,1.2,0.8,1.9s-0.3,1.4-0.9,1.9s-1.6,0.7-3,0.7h-1.8V98.6L96.1,98.6z"
          />
          <path
            d="M129.5,12.9c-2-1.9-4.3-2.9-7-2.9H75.3c-1.4,0-2.7,0.3-4,0.8c-0.2,0.1-0.3,0.2-0.4,0.3c-0.1,0-0.3,0.1-0.6,0.3
		c-0.7,0.5-1.4,1-2.1,1.5l-38,38.4c-1.8,1.8-2.7,4.1-2.7,6.8v82c0,2.7,0.9,5.1,2.8,7c1.9,1.9,4.2,2.9,6.9,2.9h85.2
		c2.7,0,5.1-1,7-2.9c2-1.9,2.9-4.2,2.9-7V19.8C132.4,17.1,131.4,14.8,129.5,12.9L129.5,12.9z M70.2,25v27.6H42.7
		C42.7,52.7,70.2,25,70.2,25z M122.6,140.2H37.4V62.5h32.7c2.7,0,5.1-1,7-2.9s2.9-4.2,2.9-7V19.8h42.5L122.6,140.2L122.6,140.2z"
          />
        </g>
        {iconStatus && (
          <>
            <path
              id="shield"
              fill={theme.palette[iconStatus || "primary"].main}
              d="M126.1,69.9c1.1,0.6,2.4,0.6,3.4,0C158,54.6,160,24.7,160,16.2c0-1.4-0.8-2.7-2.1-3.2L129.2,0.3
        c-0.9-0.4-2-0.4-2.9,0L97.9,13c-1.3,0.6-2.1,1.8-2.1,3.2C95.7,24.6,97.4,54.6,126.1,69.9L126.1,69.9z M116.1,29.2l8.2,8.2L139.5,22
        l5,5l-20.3,20.3L111,34.2C111,34.2,116.1,29.2,116.1,29.2z"
            />
            <polygon
              id="checked"
              fill="#ffffff"
              points="116.1,29.2 124.2,37.3 139.5,22 144.5,27.1 124.2,47.4 111,34.2 "
            />
          </>
        )}
      </svg>
    );
  }
);

export const CSV: React.FC<any> = React.forwardRef(
  ({ plain, iconStatus, ...rest }, ref) => {
    const theme: any = useTheme();

    return (
      <svg
        ref={ref}
        version="1.1"
        id="code"
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
          d="M27.6,59.2v82c0,2.7,0.9,5.1,2.8,7c1.9,1.9,4.2,2.9,6.9,2.9h85.2c2.7,0,5.1-1,7-2.9c2-1.9,2.9-4.2,2.9-7V20.9
	c0-2.7-1-5.1-2.9-7c-2-1.9-4.3-2.9-7-2.9H75.3c-1.4,0-2.7,0.3-4,0.8C71.1,12,71,12,70.9,12.1c-0.1,0-0.3,0.1-0.6,0.3
	c-0.7,0.5-1.4,1-2.1,1.5l-38,38.4C28.5,54.2,27.6,56.4,27.6,59.2z M37.4,63.6h32.7c2.7,0,5.1-1,7-2.9s2.9-4.2,2.9-7V20.9h42.5v120.3
	H37.4V63.6L37.4,63.6z M70.2,53.7H42.7l27.5-27.6V53.7z"
        />
        <g>
          <path
            className="st0"
            d="M44.9,94.8h22.4v5.9h-7.5v18h-7.4v-18h-7.5V94.8z"
          />
          <path
            className="st0"
            d="M68.4,94.8h8.1l4.2,7.3l4.1-7.3h8l-7.4,11.6l8.1,12.3h-8.3l-4.7-7.7l-4.7,7.7h-8.2l8.2-12.4
		C75.9,106.2,68.4,94.8,68.4,94.8z"
          />
          <path
            className="st0"
            d="M93.6,94.8H116v5.9h-7.5v18h-7.4v-18h-7.5C93.6,100.7,93.6,94.8,93.6,94.8z"
          />
        </g>
        {iconStatus && (
          <>
            <path
              id="shield"
              fill={theme.palette[iconStatus || "primary"].main}
              d="M126.1,69.9c1.1,0.6,2.4,0.6,3.4,0C158,54.6,160,24.7,160,16.2c0-1.4-0.8-2.7-2.1-3.2L129.2,0.3
        c-0.9-0.4-2-0.4-2.9,0L97.9,13c-1.3,0.6-2.1,1.8-2.1,3.2C95.7,24.6,97.4,54.6,126.1,69.9L126.1,69.9z M116.1,29.2l8.2,8.2L139.5,22
        l5,5l-20.3,20.3L111,34.2C111,34.2,116.1,29.2,116.1,29.2z"
            />
            <polygon
              id="checked"
              fill="#ffffff"
              points="116.1,29.2 124.2,37.3 139.5,22 144.5,27.1 124.2,47.4 111,34.2 "
            />
          </>
        )}
      </svg>
    );
  }
);
