import { StandartConceptTypes } from './StandartConceptTypes';

export const mapStandartConceptTypes = new Map([
  [StandartConceptTypes.STANDART, { color: '#234589', caption: 'Standard' }],
  [
    StandartConceptTypes.CLASSIFICATION,
    { color: '#e681f3', caption: 'Classification' },
  ],
  [
    StandartConceptTypes.NON_STANDART,
    { color: '#fb4242', caption: 'Non-Standard' },
  ],
]);
