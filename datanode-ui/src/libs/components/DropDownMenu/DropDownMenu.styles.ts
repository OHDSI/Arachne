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

import { Theme } from "@mui/material";
import { setLightness, transparentize } from "polished";
import styled from "@emotion/styled";

export const menuStyles = (theme: Theme) => ({
  padding: 0,
  borderRadius: (theme.shape?.borderRadius || 0) + "px",
});

export const menuItemStyles: any = (theme: Theme) => ({
  padding: "8px 16px",
  fontSize: "0.9rem",
  fontWeight: 400,
  color: theme.palette?.grey[800] || "grey",
  "&:hover": {
    backgroundColor: transparentize(0.9, theme.palette.info.main),
  },
  "&.Mui-disabled": { backgroundColor: theme.palette.grey[100], opacity: 0.9 },
  "&.Mui-disabled *": {
    color: theme.palette.grey[800],
    backgroundColor: theme.palette.grey[400],
    opacity: 1,
    filter: "grayscale(1)",
  },
  "&.Mui-selected": {
    backgroundColor: transparentize(0.8, theme.palette.info.main),
  },
});

export const menuContainerStyles = (theme: Theme) => ({
  borderRadius: (theme.shape?.borderRadius || 0) + "px",
});

export const IconWrapper = styled.div`
  position: relative;
  top: 2px;
  display: inline-block;
  margin-right: 5px;
`;

export const Line = styled.div`
  border-bottom: 1px solid #c3cad1;
`;
