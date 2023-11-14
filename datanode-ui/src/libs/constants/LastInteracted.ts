import { LastInteractedEntityType } from "../enums/LastInteractedEntityType";


export const lastInteractedEntityMapping = {
  [LastInteractedEntityType.ANALYSIS]: 'Analysis',
  [LastInteractedEntityType.COHORT]: 'Cohort',
  [LastInteractedEntityType.CONCEPT_SET]: 'Concept set',
};

export const lastInteractedPathMapping = {
  [LastInteractedEntityType.ANALYSIS]: 'analyses',
  [LastInteractedEntityType.COHORT]: 'cohorts',
  [LastInteractedEntityType.CONCEPT_SET]: 'concept-sets',
};
