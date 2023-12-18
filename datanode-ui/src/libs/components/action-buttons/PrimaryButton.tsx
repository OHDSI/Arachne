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

import React, { FC, ReactNode } from "react";
import { ButtonProps } from "./Button.types";
import { Tooltip } from "../Tooltip/Tooltip";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";

export const PrimaryButton: FC<ButtonProps> = ({
  onClick,
  size,
  children,
  iconName,
  tooltipText = "",
  id,
  name,
  className,
}) => {
  return (
    <Tooltip text={tooltipText}>
      <Button
        id={id}
        name={name}
        className={className}
        color="info"
        variant="contained"
        onClick={onClick}
        size={size}
        sx={{
          fontSize: { xsmall: 14, small: 16 }[size] || 14,
          px: 2,
          fontWeight: 600,
        }}
        startIcon={<Icon iconName={iconName} />}
      >
        {children}
      </Button>
    </Tooltip>
  );
};
