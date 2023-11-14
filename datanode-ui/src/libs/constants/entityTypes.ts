import { EntityTypes } from "../enums/EntityTypes";


export const entityTypes = [
  {
    value: EntityTypes.COHORT,
    name: 'Cohort',
  },
  {
    value: EntityTypes.CONCEPT_SET,
    name: 'Concept set',
  },
  {
    value: EntityTypes.FEATURE_ANALYSIS,
    name: 'Feature analysis',
  },
  {
    value: EntityTypes.DATA_SOURCE,
    name: 'Data source',
  },
];

export const ENTITY_TYPES = {
  [EntityTypes.COHORT]: {
    name: 'Cohort',
    iconName: 'cohort',
    type: EntityTypes.COHORT,
    color: '#33c480',
  },
  [EntityTypes.CONCEPT_SET]: {
    name: 'Concept set',
    iconName: 'conceptSets',
    type: EntityTypes.CONCEPT_SET,
    color: '#49d1ff',
  },
  [EntityTypes.FEATURE_ANALYSIS]: {
    name: 'Feature analysis',
    iconName: 'analysis',
    color: '#ffc901',
    type: EntityTypes.FEATURE_ANALYSIS,
  },
};
