import { AnalysisTypes } from "../enums/AnalysisTypes";


export const iconAnalyses = {
  ['DEFAULT']: {
    icon: 'analysis',
    color: '#0d1b40',
    name: 'Analysis',
  },
  [AnalysisTypes.COHORT]: {
    icon: 'analysisSimpleCount',
    color: '#33c480',
    name: 'Cohort (Simple Counts)',
  },
  [AnalysisTypes.INCIDENCE]: {
    icon: 'analysisIncidence',
    color: '#49d1ff',
    name: 'Incidence rates',
  },
  [AnalysisTypes.COHORT_PATHWAY]: {
    icon: 'analysisPathway',
    color: '#b777ff',
    name: 'Cohort Pathway',
  },
  [AnalysisTypes.COHORT_CHARACTERIZATION]: {
    icon: 'analysisCharacterization',
    color: '#ff7171',
    name: 'Cohort (Characterization)',
  },
  [AnalysisTypes.SIMPLE_COUNTS_CHARACTERIZATION]: {
    icon: 'documents',
    color: '#ff7171',
    name: 'Simple Counts with Characterization',
  },
  [AnalysisTypes.CUSTOM]: {
    icon: 'documents',
    color: '#f5b502',
    name: 'Custom',
  },
  [AnalysisTypes.STRATEGUS]: {
    icon: 'documents',
    color: '#f5b502',
    name: 'Strategus',
  },
  [AnalysisTypes.ESTIMATION]: {
    icon: 'documents',
    color: '#79ba38',
    name: 'Estimation',
  },
  [AnalysisTypes.PREDICTION]: {
    icon: 'documents',
    color: '#d69d00',
    name: 'Prediction',
  },
};
