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

import React, { FC, useState, MouseEvent, useCallback } from "react";
import clsx from "clsx";
import {
  BlockBase,
  BlockBaseBodyContent,
  BlockBaseSectionTitle,
  Content,
} from "../BlockBase";
import type { ContentBlockProps } from "./ContentBlock.types";
import { BlockBaseHeadContent } from "./ContentBlock.styles";
import { Icon } from "../..";

export const ContentBlock: FC<ContentBlockProps> = props => {
  const {
    title = "",
    children,
    className,
    defaultState = true,
    size = "normal",
    isDark = false,
    collapsible = false,
    actions,
    unstyled,
  } = props;
  const [isShow, setIsShow] = useState<boolean>(defaultState);

  const handleToggleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsShow(prevVal => !prevVal);
  }, []);

  return (
    <BlockBase
      className={clsx(
        className,
        collapsible ? "collapsible-block" : "plain-block"
      )}
      isDark={isDark}
    >
      {collapsible && (
        <BlockBaseHeadContent
          onClick={handleToggleClick}
          className={
            "collapsible-content-block__title " +
            (isShow ? "content-visible" : "")
          }
        >
          <Icon
            iconName={!isShow ? "expand" : "collapse"}
            sx={{
              fontSize: 16,
              pr: 1.5,
              color: "textColor.header",
              opacity: 0.75,
            }}
          />
          <BlockBaseSectionTitle unstyled={unstyled}>
            <div className="collapsible-content-block__title-text">{title}</div>
            <div>{actions}</div>
          </BlockBaseSectionTitle>
        </BlockBaseHeadContent>
      )}
      <Content className="collapsible-block__content">
        {isShow && (
          <BlockBaseBodyContent
            className={clsx(
              "collapsible-block__content-container",
              collapsible ? "" : "plain-block"
            )}
            isDark={isDark}
          >
            {children}
          </BlockBaseBodyContent>
        )}
      </Content>
    </BlockBase>
  );
};
