import React from 'react';
import { NameWrapper, SubtitleWrapper } from './NameWithSubtitleCell.styles';
import { lastInteractedEntityMapping } from '../../../constants/LastInteracted';
import { analysisTypesMap } from '../../..//constants';

export interface NameWithSubtitleCellProps {
  value: string;
  row: any;
}
export const NameWithSubtitleCell: React.FC<NameWithSubtitleCellProps> = ({
  value,
  row,
}) => {
  const type = row.original?.type;
  const entityType = row.original?.entityType;
  return (
    <div>
      <NameWrapper>{value}</NameWrapper>
      <SubtitleWrapper>
        {entityType ? lastInteractedEntityMapping[entityType] : ''}{' '}
        {type ? ' - ' + analysisTypesMap[type] : ''}
      </SubtitleWrapper>
    </div>
  );
};
