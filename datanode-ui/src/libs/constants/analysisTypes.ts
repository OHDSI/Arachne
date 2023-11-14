import { AnalysisTypes } from "../enums/AnalysisTypes";


export const analysisTypes = [
  {
    value: AnalysisTypes.COHORT,
    name: 'Cohort (Simple Counts)',
  },
  {
    value: AnalysisTypes.INCIDENCE,
    name: 'Incidence rates',
  },
  {
    value: AnalysisTypes.COHORT_CHARACTERIZATION,
    name: 'Cohort (Characterization)',
  },
  {
    value: AnalysisTypes.SIMPLE_COUNTS_CHARACTERIZATION,
    name: 'Simple Counts with Characterization',
  },
  {
    value: AnalysisTypes.COHORT_PATHWAY,
    name: 'Cohort Pathway',
  },
  {
    value: AnalysisTypes.CUSTOM,
    name: ' Custom',
  },
  {
    value: AnalysisTypes.ESTIMATION,
    name: 'Estimation',
  },
  {
    value: AnalysisTypes.STRATEGUS,
    name: 'Strategus',
  },
];

export const analysisTypesMap = {
  [AnalysisTypes.COHORT]: 'Cohort (Simple Counts)',
  [AnalysisTypes.INCIDENCE]: 'Incidence rates',
  [AnalysisTypes.COHORT_CHARACTERIZATION]: 'Cohort (Characterization)',
  [AnalysisTypes.COHORT_PATHWAY]: 'Cohort Pathway',
  [AnalysisTypes.ESTIMATION]: 'Estimation',
  [AnalysisTypes.CUSTOM]: 'Custom',
  [AnalysisTypes.STRATEGUS]: 'Strategus',
  [AnalysisTypes.SIMPLE_COUNTS_CHARACTERIZATION]:
    'Simple Counts with Characterization',
};
