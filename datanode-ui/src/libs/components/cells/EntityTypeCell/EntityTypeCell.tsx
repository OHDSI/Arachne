

import styled from '@emotion/styled';
import { Icon } from '../../Icon/Icon';
import { LastInteractedEntityType } from '../../../enums/LastInteractedEntityType';

function getEntityCellColor(value: LastInteractedEntityType) {
  switch (value) {
    case LastInteractedEntityType.ANALYSIS:
      return '#C5DFF8';
    case LastInteractedEntityType.COHORT:
      return '#F4F255';
    case LastInteractedEntityType.CONCEPT_SET:
      return '#B7E9A1';
  }
}

export const IconWrapper = styled('div')<{ color: string }>(
  ({ color, theme }: any) => ({
    display: 'inline-block',
    background: color || theme.palette.secondary.main,
    padding: '7px',
    width: 32,
    height: 32,
    borderRadius: '50%',
    boxSizing: 'border-box',
  })
);

export interface EntityTypeCellProps {
  value: LastInteractedEntityType;
}
export const EntityTypeCell: React.FC<EntityTypeCellProps> = ({ value }) => {
  return (
    <IconWrapper color={getEntityCellColor(value)}>
      <Icon
        iconName={value}
        sx={(theme: any) => ({
          fontSize: 18,
          color: theme.palette.textColor.secondary,
        })}
      />
    </IconWrapper>
  );
};
