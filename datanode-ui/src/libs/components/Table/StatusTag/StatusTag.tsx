import React from 'react';
import { StatusItem } from './StatusTag.styles';
import { Spinner } from '../../Spinner';

export interface StatusTagProps {
  text: string;
  color?: string;
  light?: boolean;
}

export const StatusTag: React.FC<StatusTagProps> = props => {
  const { text, color, light } = props;
  return (
    <StatusItem color={color} light={light} className="status-tag">
      <span>{text}</span> {text === 'Executing' && <Spinner size={9} />}
    </StatusItem>
  );
};
