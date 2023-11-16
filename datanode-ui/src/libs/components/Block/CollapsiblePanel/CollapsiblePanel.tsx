import React, { FC, useState, useCallback, MouseEvent } from 'react';
import clsx from 'clsx';
// import { BlockBase } from '../BlockBase';
import type { ICollapsiblePanelProps } from './CollapsiblePanel.types';
import {
  CollapsiblePanelHeadContent,
  CollapsiblePanelSectionTitle,
  CollapseIconArrow,
  CollapsiblePanelBlock,
} from './CollapsiblePanel.styles';
export const CollapsiblePanel: FC<ICollapsiblePanelProps> = props => {
  const {
    title = '',
    className = '',
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
      className={clsx(className, 'collapsible-block-panel')}
    >
      {collapsible && (
        <CollapsiblePanelHeadContent
          onClick={onToggleClick}
          className={clsx('content-block__heading', {
            collapsed: !isShow,
            'content-visible': isShow,
          })}
        >
          <CollapsiblePanelSectionTitle className="content-block__title">
            {title}
          </CollapsiblePanelSectionTitle>
          <CollapseIconArrow
            className={clsx('content-block__collapse-icon', { down: !isShow })}
          />
        </CollapsiblePanelHeadContent>
      )}
      {isShow && children}
    </CollapsiblePanelBlock>
  );
};
