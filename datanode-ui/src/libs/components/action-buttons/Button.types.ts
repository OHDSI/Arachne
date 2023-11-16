
import { ButtonBaseProps } from '@mui/material';
import { ReactNode } from 'react';
export interface ButtonProps {
  onClick: (e: any) => void;
  size: any;
  iconName: string;
  children?: ReactNode;
  tooltipText?: string;
  id?: string;
  name?: string;
  sx?: any;
  className?: string;
}
