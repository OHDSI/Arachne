import { AnalysisTypes } from "../enums/AnalysisTypes";
import { ImportAtlasAsset } from "../enums/ImportAtlasAsset";


export const atlasAssetList = [
  {
    value: ImportAtlasAsset.COHORT,
    name: 'Cohort',
    type: AnalysisTypes.COHORT,
  },
  {
    value: ImportAtlasAsset.CS,
    name: 'Concept set',
  },
  {
    value: ImportAtlasAsset.CC,
    name: 'Cohort (Characterization)',
    type: AnalysisTypes.COHORT_CHARACTERIZATION,
  },
  {
    value: ImportAtlasAsset.PATHWAY,
    name: 'Cohort Pathway',
    type: AnalysisTypes.COHORT_PATHWAY,
  },
  {
    value: ImportAtlasAsset.IR,
    name: 'Incidence rates',
    type: AnalysisTypes.INCIDENCE,
  },
  {
    value: ImportAtlasAsset.PLE,
    name: 'Estimation',
    type: AnalysisTypes.ESTIMATION,
  },
  {
    value: ImportAtlasAsset.PLP,
    name: 'Prediction',
    type: AnalysisTypes.PREDICTION,
  },
];
