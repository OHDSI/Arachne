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

// import { makeStyles, Theme } from '@mui/material';
import { styled, Theme } from "@mui/material/styles";
import { darken, transparentize } from "polished";

type TableProps = {
  clickable?: boolean;
  isLoading?: boolean;
  paginationPosition?: string;
};

export const StyledTable: any = styled("table") <TableProps>`
  border-collapse: collapse;
  font-family: ${({ theme }: { theme: Theme }) =>
    theme.typography?.fontFamily || "sans-serif"};
  font-size: ${({ theme }: { theme: Theme }) => theme.typography?.fontSize}px;
  color: ${({ theme }: { theme: Theme }) => theme.palette?.grey[500]};
  width: 100%;
`;

export const TableRow: any = styled("tr", {
  shouldForwardProp: prop => prop !== "tileView",
})`
  border-bottom: 1px solid
    ${({ theme }: any) => darken(0.05, theme.palette.borderColor.light)};
  td {
    color: ${({ theme }: any) => theme.palette.textColor.secondary};
    font-weight: 400;
    font-size: 14px;
    z-index: 1;
    position: relative;
    /* height: 44px; */
  }
  position: relative;
  :hover {
    background-color: ${({ theme }) =>
    transparentize(0.9, theme.palette.info.main)};
  }
  ${({ tileView, theme }: any) =>
    tileView &&
    `border: none;
    :hover {
      background-color: transparent;
      ::after { 
        background-color: ${transparentize(0.9, theme.palette.info.main)};
      }
    }
    td {
      height: 46px;
    }
    ::after {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: calc(100% - 10px);
    margin: 5px 0;
    left: 0;
    background-color: ${theme.palette.backgroundColor.main};
    z-index: 0;
   
    border-radius: 4px;
  }`}/* ::after {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: calc(100% - 10px);
    margin: 5px 0;
    left: 0;
    background-color: ${({ theme }: any) => theme.palette.backgroundColor.main};
    z-index: 0;
    border-radius: 4px;
  } */
`;

export const TableHeadRow: any = styled("tr")`
  background-color: inherit;
  border-bottom: 1px solid ${({ theme }: any) => theme.palette.borderColor.main};
  /* border-bottom: 1px solid ${({ theme }: any) =>
    theme.palette?.borderColor.main}; */
  & th {
    font-weight: 800;
    white-space: nowrap;
    color: ${({ theme }: any) => theme.palette.textColor.label};
    font-size: 12px;
    padding: 12px 8px;
    text-align: left;
    &:first-of-type {
      padding-left: 16px;
    }
    &:last-of-type {
      padding-right: 16px;
    }
  }
`;

export const ArrowContainer: any = styled("div")`
  display: inline-block;
  text-align: center;
  width: 14px;
`;

export const TableContainer: any = styled("div")`
  min-height: ${({ isLoading }: any) => (isLoading ? "108px" : "")};
  overflow-x: auto;
`;

export const TableActions: any = styled("div")`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme, ...props }: any) => {
    if (props.paginationPosition === "top") {
      return "0 0 10px 0";
    } else if (props.paginationPosition === "bottom") {
      return "10px 0 0 0";
    } else {
      return "10px ";
    }
  }};
`;

export const Container: any = styled("div")`
  position: relative;
  margin: ${({ theme, ...props }: any) =>
    props.paginationPosition === "both" ? "-10px 0" : ""};
`;

export const LoaderContainer: any = styled("div")`
  position: absolute;
  width: 100%;
  height: calc(100% - 30px);
  text-align: center;
  padding-top: 30px;
  z-index: 2;
  font-family: ${({ theme }) => theme?.typography?.fontFamily || "sans-serif"};
  font-size: ${({ theme }) => theme?.typography?.fontSize || 14}px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  /* & > div {
    margin-top: 10px;
  } */
  /* pointer-events: none; */
  background: ${({ theme }) => transparentize(0.5, "#ffffff")};
`;

export const NoDataText: any = styled("div")`
  font-family: ${({ theme }) => theme.typography?.fontFamily || "sans-serif"};
  font-size: ${({ theme }) => theme.typography?.fontSize}px;
  color: ${({ theme }) => theme.palette?.grey[900]};
  text-align: center;
`;
