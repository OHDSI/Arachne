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

import { Radio, RadioProps } from "../Radio/Radio";
import { Checkbox, CheckboxProps } from "../Checkbox/Checkbox";
import { Input } from "../Input/Input";
// import { Theme } from '../common/interfaces';
import { transparentize } from "polished";
import { Chip, ChipProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { StyledComponent } from "@emotion/styled";

export const Container: any = styled("div")`
  font-family: ${({ theme }: any) =>
    theme.typography?.fontFamily || "sans-serif"};
  font-weight: ${({ theme }: any) => theme.typography?.fontWeightLight || 300};
  .c-filter-panel {
    padding-bottom: 8px;
  }
  .filter-block__head {
    font-size: 12px;
    padding: 8px 0;
    font-weight: 600;
    background-color: transparent;
    border-bottom: none;
  }

  width: 100%;

  &.dense {
    width: 240px;
    .backdrop {
      padding: 0;
    }
    .search-field__container {
      /* padding: 0 10px 5px; */
    }
    /* .c-input-item { */

    /* } */

    .c-filter-panel {
      padding-bottom: 12px;
    }
    .filter-block__head {
      padding: 4px 0;
    }
    .filter-block__option {
      font-size: 13px;
      padding: 0 5px;
      .checkbox-root {
        padding: 0 5px;
      }
    }
    .filter-block__content {
      padding: 5px 0;
      background-color: transparent;
      .filter-block__option {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 5px;
        :hover {
          background-color: ${({ theme }) => theme.palette?.secondary.main};
        }
      }
    }
  }
`;

export const Block: StyledComponent<any> = styled("div")`
  display: flex;
  flex-direction: column;
  margin-top: 0px;

  .search-field__container {
    padding: 5px 10px;
  }
  span.c-checkbox {
    padding: 2px 5px 2px 2px;
  }
  &.c-switch-item {
    padding: 8px 0;
    margin-top: 0;
  }
  & .filter-block__head {
    font-weight: 500;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }: any) => theme.palette?.primary.main};
    /* text-transform: uppercase; */
    padding: 8px 0;

    font-weight: bold;
    border-radius: 4px;

    &:hover {
      cursor: pointer;
    }
    .filter-block__head-title {
      display: flex;
      justify-content: flex-start;
      line-height: 18px;
      .filter-block__head-icon {
        margin-right: 5px;
        color: ${({ theme }: { theme: Theme }) => theme.palette?.grey[800]};
      }
    }
  }
  & .filter-block__content {
    max-height: auto;
    height: auto;
    overflow-y: initial;
    /* padding: 5px 5px 0; */
  }
  .filter-block__search-content {
    padding-top: 12px;
  }
  .filter-block__option span {
    line-height: 24px;
  }
`;

export const Item: StyledComponent<any> = styled("label")`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }: any) => theme.palette?.grey[800]};
  & .switch-item-label {
    padding: 0 8px;
    font-size: 14px;
    font-weight: 400;
  }
  &.switch-item-wrapper {
    /* background-color: #eff2f8; */
    border-radius: 4px;
    padding: 0;
  }
`;

export const DatePickerContainer: StyledComponent<
  React.HTMLAttributes<HTMLDivElement>
> = styled("div")`
  display: flex;
  & > div:first-child {
    margin-right: 10px;
  }
  & > div:last-child {
    margin-left: 10px;
  }
`;

export const CheckboxStyled: StyledComponent<CheckboxProps> = styled(Checkbox)`
  color: ${({ theme }: any) => theme.palette?.grey[500]};

  &[class*='MuiCheckbox-root'] {
    padding: 5px;
  }
`;
export const RadioStyled: StyledComponent<RadioProps> = styled(Radio)`
  color: ${({ theme }: any) => theme.palette?.grey[500]};
  padding: 5px 5px 5px 0;
`;

export const LoaderContainer: StyledComponent<
  React.HTMLAttributes<HTMLDivElement>
> = styled("div")`
  text-align: center;
  padding: 0px;
`;

export const Tag: StyledComponent<
  React.HTMLAttributes<HTMLDivElement>
> = styled("div")`
  /* background-color: ${({ theme }: any) =>
    (theme.palette && theme.palette.grey[200]) || "lightgrey"}; */
  border-radius: 10px;
  padding: 2px 10px;
  margin-left: 10px;
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 400;
  min-width: 15px;
  text-align: center;
`;

export const SearchFieldContainer: StyledComponent<
  React.HTMLAttributes<HTMLDivElement>
> = styled("div")`
  padding: 0 5px 8px;
  .input .input-root.input-small {
    padding-left: 0;
    .input-base {
      font-size: 14px;
    }
  }
`;
export const SearchField: StyledComponent<any> = styled<any>(Input)`
  .input-notched-outline {
    border-left: none;
    border-right: none;
    border-top: none;
  }
  &.input {
    background-color: transparent;
    .input-root:hover,
    .input-focused {
      .input-notched-outline {
        border-left: none;
        border-right: none;
        border-top: none;
      }
    }
  }
`;

export const IconButton: StyledComponent<
  React.HTMLAttributes<HTMLButtonElement> & {
    type?: "button" | "reset" | "submit";
  }
> = styled("button")`
  cursor: pointer;
  background-color: transparent;
  border: none;
  min-width: auto !important;
  &:hover {
    background-color: ${(props: any) =>
    transparentize(0.85, props.theme.palette?.secondary.main)};
  }
`;

export const CounterTag: StyledComponent<ChipProps> = styled(Chip)(
  ({ theme }: any) => ({
    height: 18,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 500,
    color: theme.palette.textColor.secondary,
    backgroundColor: transparentize(0.9, theme.palette.info.main),
    ".MuiChip-label": {
      py: 0.5,
      px: 1,
    },
  })
);
