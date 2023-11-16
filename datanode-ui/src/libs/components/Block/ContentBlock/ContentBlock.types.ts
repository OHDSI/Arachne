import { ReactNode } from 'react';

export interface ContentBlockProps {
  title?: ReactNode;
  actions?: ReactNode;
  className?: string;
  defaultState?: boolean;
  size?: 'dense' | 'normal';
  children?: React.ReactNode;
  isDark?: boolean;
  collapsible?: boolean;
  unstyled?: boolean;
}
