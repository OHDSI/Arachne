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

import {
  Breadcrumbs,
  BreadcrumbsProps,
  Typography,
  TypographyProps,
  styled,
  SkeletonProps,
} from "@mui/material";
import { Skeleton } from "../Skeleton/Skeleton";
import { transparentize } from "polished";
import { StyledComponent } from "@emotion/styled";

export const StyledBreadcrumbs: StyledComponent<BreadcrumbsProps> = styled(
  Breadcrumbs
)`
  font-size: 14px;
  line-height: inherit;
  height: 50px;
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  .breadcrumbs-separator {
    margin: 0;
    // height: calc(100% - 2px);
    // width: 0;
    overflow: hidden;
    // border-right: 1px solid #cfcfcf;
  }
  .favorite-icon {
    display: none;
  }
  ol {
    flex-wrap: nowrap;
    height: 100%;
    padding-left: 10px;

    li.MuiBreadcrumbs-li {
      padding: 0 12px;
      position: relative;
      top: 2px;
    }
  }
`;

export const Link: StyledComponent<TypographyProps> = styled(Typography)`
  font-size: 14px;
  line-height: inherit;
  cursor: pointer;
  & > *:hover {
    color: ${({ theme }: any) => theme.palette?.secondary.main || "grey"};
    text-decoration: underline;
  }
`;

export const LinkCurrent: StyledComponent<TypographyProps> = styled(Typography)`
  /* text-transform: capitalize; */
  font-size: 14px;
  font-weight: bold;
  line-height: inherit;
  color: ${({ theme }: any) => theme.palette?.primary.main};
  width: 100%;
`;

export const BreadcrumbText: StyledComponent<any> = styled("span")`
  display: inline-block;
  color: ${({ theme }: any) => theme.palette?.grey[200] || "grey"};
  /* font-family: ${({ theme }: any) => theme.typography?.fontFamily}; */
  /* background-color: ${({ theme }: any) => theme.palette?.secondary.light}; */
  /* padding: 4px 0; */
  border-radius: 4px;
  min-width: 20px;
  max-width: 400px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &.c-breadcrumb-text-current {
    color: #ffffff;
  }
`;

export const Loader: StyledComponent<SkeletonProps> = styled(Skeleton)`
  background-color: ${({ theme }: any) =>
    transparentize(0.5, theme.palette?.secondary.main)};
`;

export const LoaderContainer: StyledComponent<any> = styled("div")`
  /* display: flex; */
  height: 54px;
  padding: 12px 0;
  > * {
    margin-top: 8px;
  }
`;
