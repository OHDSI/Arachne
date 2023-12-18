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

import styled from "@emotion/styled";
import { transparentize } from "polished";

export const TileContainer = styled.div<any>`
  display: flex;
  flex-direction: column;
  width: calc(50% - 52px);
  min-width: 260px;
  margin: 10px 10px 0;
  padding: 15px 20px;
  border: 1px solid ${({ theme }: any) => theme.palette?.borderColor.main};
  background-color: ${({ theme }: any) => theme.palette?.backgroundColor.dark};
  color: ${({ theme }: any) => theme.palette?.grey[800]};
  font-family: ${({ theme }: any) => theme.typography?.fontFamily};
  font-size: 14px;
  :hover {
    cursor: pointer;
    border: 1px solid ${({ theme }: any) => theme.palette?.primary.main};
    background-color: ${({ theme }: any) => theme.palette?.backgroundColor.main};
  }
  :nth-child(2n + 1) {
    margin-left: 0;
  }
  :nth-child(2n) {
    margin-right: 0;
  }
`;

export const TileRow = styled.div<any>`
  display: flex;
  justify-content: ${({ justify }) => justify || "flex-start"};
  align-items: center;
  :not(:last-of-type) {
    margin-bottom: 8px;
  }
  :last-of-type {
    height: 100%;
  }
`;

export const TileName = styled.div`
  font-size: 16px;
  display: flex;
  font-weight: 600;
  color: ${({ theme }: any) => theme.palette?.primary.main};
`;

export const TextRow = styled.div`
  color: ${({ theme }: any) => theme.palette?.grey[500]};
  font-size: 13px;
  > span {
    color: ${({ theme }: any) => theme.palette?.grey[800]};
  }
  :not(:last-of-type) {
    margin-bottom: 6px;
  }
`;

export const UserLink = styled.span`
  color: ${({ theme }: any) => theme.palette?.primary.main};
  font-size: 14px;
  font-weight: 400;
  margin-right: 5px;
  :hover {
    color: ${({ theme }: any) => theme.palette?.primary.dark};
    background: ${({ theme }: any) =>
    transparentize(0.9, theme.palette?.primary.main)};
    box-shadow: 0px 0px 0px 3px
      ${({ theme }: any) =>
    transparentize(0.9, theme.palette?.primary.main || "#000000")};
    border-radius: 4px;
  }
`;

export const UserLinkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
`;

export const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;
  .c-icon {
    margin-right: 5px;
  }
`;
