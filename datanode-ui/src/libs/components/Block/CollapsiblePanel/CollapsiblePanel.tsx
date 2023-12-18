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

import React, { FC, useState, useCallback, MouseEvent } from "react";
import clsx from "clsx";
// import { BlockBase } from '../BlockBase';
import type { ICollapsiblePanelProps } from "./CollapsiblePanel.types";
import {
  CollapsiblePanelHeadContent,
  CollapsiblePanelSectionTitle,
  CollapseIconArrow,
  CollapsiblePanelBlock,
} from "./CollapsiblePanel.styles";
export const CollapsiblePanel: FC<ICollapsiblePanelProps> = props => {
  const {
    title = "",
    className = "",
    collapsible = false,
    visible = true,
    onAction,
    children,
  } = props;
  const [isShow, setIsShow] = useState<boolean>(visible);

  const onToggleClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setIsShow(prevVal => !prevVal);
      onAction?.();
    },
    [onAction]
  );

  return (
    <CollapsiblePanelBlock
      className={clsx(className, "collapsible-block-panel")}
    >
      {collapsible && (
        <CollapsiblePanelHeadContent
          onClick={onToggleClick}
          className={clsx("content-block__heading", {
            collapsed: !isShow,
            "content-visible": isShow,
          })}
        >
          <CollapsiblePanelSectionTitle className="content-block__title">
            {title}
          </CollapsiblePanelSectionTitle>
          <CollapseIconArrow
            className={clsx("content-block__collapse-icon", { down: !isShow })}
          />
        </CollapsiblePanelHeadContent>
      )}
      {isShow && children}
    </CollapsiblePanelBlock>
  );
};
