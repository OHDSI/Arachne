import { AnalysisTypes } from "../enums/AnalysisTypes";


export const analysisBaseInfoActions = [
  {
    id: 'DEFAULT',
    name: 'Create Analysis',
    desc: '',
    endGroup: true,
  },
  {
    id: AnalysisTypes.COHORT,
    name: 'Use in Cohort (Simple Count)',
    desc: '',
  },
  {
    id: AnalysisTypes.SIMPLE_COUNTS_CHARACTERIZATION,
    name: 'Use in Cohort (Simple Count with Characterization)',
    desc: '',
  },
  {
    id: AnalysisTypes.COHORT_PATHWAY,
    name: 'Use in Cohort Pathway',
    desc: '',
  },
  {
    id: AnalysisTypes.INCIDENCE,
    name: 'Use in Incidence Rates',
    desc: '',
  },
  {
    id: AnalysisTypes.COHORT_CHARACTERIZATION,
    name: 'Use in Cohort (Characterization)',
    desc: '',
  },
];
