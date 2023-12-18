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

import { ButtonProps, Button, styled } from "@mui/material";
import { StyledComponent } from "@emotion/styled";

export const StyledButton: StyledComponent<
  ButtonProps & { buttonSize: ButtonProps["size"] | "xsmall" }
> = styled(Button, {
  shouldForwardProp: prop => prop !== "buttonSize",
})`
  &.MuiButton-outlined {
    background: #ffffff;
  }
  text-transform: none;
  font-weight: bold;
  box-shadow: none;
  ${({ buttonSize }: any) => {
    switch (buttonSize) {
    case "xsmall":
      return "height: 24px; padding: 4px 8px;";
    case "large":
      return "height: 48px; padding: 12px 24px;";
    }
  }}
  .start-icon,
  .end-icon {
    &-xsmall {
      svg {
        font-size: 12px;
      }
    }
    &-small {
      svg {
        font-size: 14px;
      }
    }
    &-medium {
      svg {
        font-size: 16px;
      }
    }
    &-large {
      svg {
        font-size: 18px;
      }
    }
  }

  &.Mui-disabled {
    .end-icon,
    .start-icon .c-icon {
      color: ${({ theme }) => theme.palette.grey[400]};
    }
  }
`;
