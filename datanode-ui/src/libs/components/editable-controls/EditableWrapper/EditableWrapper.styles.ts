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

import { styled } from "@mui/material";
import { shouldForwardProp } from "@mui/system";

export const StyledInputWrapper = styled("form", {
  shouldForwardProp: prop => prop !== "disabled",
})<{ disabled: boolean }>(({ theme, disabled }) => ({
  position: "relative",
  pointerEvents: disabled ? "none" : "auto",
  ".editable-component-actions": {
    position: "absolute",
    right: 0,
    bottom: "calc(-30px - 4px)",
    display: "inline-flex",
    width: "auto",
    zIndex: 2,
  },
}));
