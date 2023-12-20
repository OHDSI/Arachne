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

import { ButtonProps as Props } from "@mui/material/Button";
import React from "react";
import { StyledButton } from "./Button.styles";

// declare module '@mui/material/Button' {
//   interface ButtonPropsSizeOverrides {
//     xsmall: true;
//   }
// }
export type ButtonProps = Omit<Props, "size"> & {
  size?: Props["size"] | "xsmall";
};

export const Button: React.FC<ButtonProps> = React.forwardRef((props, ref) => {
  const size = React.useMemo(
    () => (props.size === "xsmall" ? "small" : props.size) || "medium",
    [props.size]
  );
  return (
    <StyledButton
      ref={ref}
      {...props}
      size={size}
      buttonSize={props.size}
      classes={{
        startIcon: "start-icon start-icon-" + size,
        endIcon: "end-icon end-icon-" + size,
      }}
    >
      {props.children}
    </StyledButton>
  );
});
