import { ReactNode } from 'react';

export interface ICollapsiblePanelProps {
  title?: string | ReactNode;
  className?: string;
  collapsible?: boolean;
  visible?: boolean;
  onAction?: () => any;
  children?: React.ReactNode;
}
