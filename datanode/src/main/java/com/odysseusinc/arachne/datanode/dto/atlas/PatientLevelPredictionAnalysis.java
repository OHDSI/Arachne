/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: Nov 1, 2017
 *
 */

package com.odysseusinc.arachne.datanode.dto.atlas;

import java.util.Date;

public class PatientLevelPredictionAnalysis {
	
    private Integer analysisId;

    private String name;

    private Integer treatmentId;
		
    private Integer outcomeId;
		
    private String modelType;

    private int timeAtRiskStart;

    private int timeAtRiskEnd;
		
    private int addExposureDaysToEnd;

    private int minimumWashoutPeriod;
		
    private int minimumDaysAtRisk;
		
    private int requireTimeAtRisk;
		
    private int minimumTimeAtRisk;
		
    private int sample;
		
    private int sampleSize;
		
    private int firstExposureOnly;

    private int includeAllOutcomes;

    private int rmPriorOutcomes;
		
    private int priorOutcomeLookback;
		
    private int testSplit;
		
    private String testFraction;

    private String nFold;

    private String moAlpha;
		
    private String moClassWeight;

    private String moIndexFolder;

    private String moK;

    private String moLearnRate;

    private String moLearningRate;

    private String moMaxDepth;

    private String moMinImpuritySplit;

    private String moMinRows;

    private String moMinSamplesLeaf;

    private String moMinSamplesSplit;

    private String moMTries;

    private String moNEstimators;

    private String moNThread;

    private String moNTrees;

    private String moPlot;

    private String moSeed;

    private String moSize;

    private String moVariance;

    private String moVarImp;

    private int cvDemographics;

    private int cvExclusionId;
				
    private int cvInclusionId;
				
    private int cvDemographicsGender;

    private int cvDemographicsRace;

    private int cvDemographicsEthnicity;

    private int cvDemographicsAge;

    private int cvDemographicsYear;

    private int cvDemographicsMonth;

    private int cvConditionOcc;

    private int cvConditionOcc365d;

    private int cvConditionOcc30d;

    private int cvConditionOccInpt180d;

    private int cvConditionEra;

    private int cvConditionEraEver;

    private int cvConditionEraOverlap;

    private int cvConditionGroup;

    private int cvConditionGroupMeddra;

    private int cvConditionGroupSnomed;

    private int cvDrugExposure;

    private int cvDrugExposure365d;

    private int cvDrugExposure30d;

    private int cvDrugEra;

    private int cvDrugEra365d;

    private int cvDrugEra30d;

    private int cvDrugEraOverlap;

    private int cvDrugEraEver;

    private int cvDrugGroup;

    private int cvProcedureOcc;

    private int cvProcedureOcc365d;

    private int cvProcedureOcc30d;

    private int cvProcedureGroup;

    private int cvObservation;

    private int cvObservation365d;

    private int cvObservation30d;

    private int cvObservationCount365d;

    private int cvMeasurement;

    private int cvMeasurement365d;

    private int cvMeasurement30d;

    private int cvMeasurementCount365d;

    private int cvMeasurementBelow;

    private int cvMeasurementAbove;

    private int cvConceptCounts;

    private int cvRiskScores;

    private int cvRiskScoresCharlson;

    private int cvRiskScoresDcsi;

    private int cvRiskScoresChads2;

    private int cvRiskScoresChads2vasc;

    private int cvInteractionYear;

    private int cvInteractionMonth;

    private int delCovariatesSmallCount;
		
    private Date created;

    private Date modified;

    private String createdBy = "anonymous";
		
    private String modifiedBy;

    public Integer getAnalysisId() {
        return analysisId;
    }

    public void setAnalysisId(Integer id) {
        this.analysisId = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getTreatmentId() {
        return treatmentId;
    }

    public void setTreatmentId(Integer treatmentId) {
        this.treatmentId = treatmentId;
    }

    public Integer getOutcomeId() {
        return outcomeId;
    }

    public void setOutcomeId(Integer outcomeId) {
        this.outcomeId = outcomeId;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getModified() {
        return modified;
    }

    public void setModified(Date modified) {
        this.modified = modified;
    }

    public String getModelType() {
        return modelType;
    }

    public void setModelType(String modelType) {
        this.modelType = modelType;
    }

    public int getTimeAtRiskStart() {
        return timeAtRiskStart;
    }

    public void setTimeAtRiskStart(int timeAtRiskStart) {
        this.timeAtRiskStart = timeAtRiskStart;
    }

    public int getTimeAtRiskEnd() {
        return timeAtRiskEnd;
    }

    public void setTimeAtRiskEnd(int timeAtRiskEnd) {
        this.timeAtRiskEnd = timeAtRiskEnd;
    }

    public int getMinimumWashoutPeriod() {
        return minimumWashoutPeriod;
    }

    public void setMinimumWashoutPeriod(int minimumWashoutPeriod) {
        this.minimumWashoutPeriod = minimumWashoutPeriod;
    }

    public int getRmPriorOutcomes() {
        return rmPriorOutcomes;
    }

    public void setRmPriorOutcomes(int rmPriorOutcomes) {
        this.rmPriorOutcomes = rmPriorOutcomes;
    }

    public int getDelCovariatesSmallCount() {
        return delCovariatesSmallCount;
    }

    public void setDelCovariatesSmallCount(int delCovariatesSmallCount) {
        this.delCovariatesSmallCount = delCovariatesSmallCount;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

	/**
	 * @return the modifiedBy
	 */
	public String getModifiedBy() {
		return modifiedBy;
	}

	/**
	 * @param modifiedBy the modifiedByUserId to set
	 */
	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	/**
	 * @return the addExposureDaysToEnd
	 */
	public int getAddExposureDaysToEnd() {
		return addExposureDaysToEnd;
	}

	/**
	 * @param addExposureDaysToEnd the addExposureDaysToEnd to set
	 */
	public void setAddExposureDaysToEnd(int addExposureDaysToEnd) {
		this.addExposureDaysToEnd = addExposureDaysToEnd;
	}

	/**
	 * @return the minimumDaysAtRisk
	 */
	public int getMinimumDaysAtRisk() {
		return minimumDaysAtRisk;
	}

	/**
	 * @param minimumDaysAtRisk the minimumDaysAtRisk to set
	 */
	public void setMinimumDaysAtRisk(int minimumDaysAtRisk) {
		this.minimumDaysAtRisk = minimumDaysAtRisk;
	}

	/**
	 * @return the requireTimeAtRisk
	 */
	public int getRequireTimeAtRisk() {
		return requireTimeAtRisk;
	}

	/**
	 * @param requireTimeAtRisk the requireTimeAtRisk to set
	 */
	public void setRequireTimeAtRisk(int requireTimeAtRisk) {
		this.requireTimeAtRisk = requireTimeAtRisk;
	}

	/**
	 * @return the minimumTimeAtRisk
	 */
	public int getMinimumTimeAtRisk() {
		return minimumTimeAtRisk;
	}

	/**
	 * @param minimumTimeAtRisk the minimumTimeAtRisk to set
	 */
	public void setMinimumTimeAtRisk(int minimumTimeAtRisk) {
		this.minimumTimeAtRisk = minimumTimeAtRisk;
	}

	/**
	 * @return the sample
	 */
	public int getSample() {
		return sample;
	}

	/**
	 * @param sample the sample to set
	 */
	public void setSample(int sample) {
		this.sample = sample;
	}

	/**
	 * @return the sampleSize
	 */
	public int getSampleSize() {
		return sampleSize;
	}

	/**
	 * @param sampleSize the sampleSize to set
	 */
	public void setSampleSize(int sampleSize) {
		this.sampleSize = sampleSize;
	}

	/**
	 * @return the firstExposureOnly
	 */
	public int getFirstExposureOnly() {
		return firstExposureOnly;
	}

	/**
	 * @param firstExposureOnly the firstExposureOnly to set
	 */
	public void setFirstExposureOnly(int firstExposureOnly) {
		this.firstExposureOnly = firstExposureOnly;
	}

	/**
	 * @return the includeAllOutcomes
	 */
	public int getIncludeAllOutcomes() {
		return includeAllOutcomes;
	}

	/**
	 * @param includeAllOutcomes the includeAllOutcomes to set
	 */
	public void setIncludeAllOutcomes(int includeAllOutcomes) {
		this.includeAllOutcomes = includeAllOutcomes;
	}

	/**
	 * @return the priorOutcomeLookback
	 */
	public int getPriorOutcomeLookback() {
		return priorOutcomeLookback;
	}

	/**
	 * @param priorOutcomeLookback the priorOutcomeLookback to set
	 */
	public void setPriorOutcomeLookback(int priorOutcomeLookback) {
		this.priorOutcomeLookback = priorOutcomeLookback;
	}

	/**
	 * @return the testSplit
	 */
	public int getTestSplit() {
		return testSplit;
	}

	/**
	 * @param testSplit the testSplit to set
	 */
	public void setTestSplit(int testSplit) {
		this.testSplit = testSplit;
	}

	/**
	 * @return the testFraction
	 */
	public String getTestFraction() {
		return testFraction;
	}

	/**
	 * @param testFraction the testFraction to set
	 */
	public void setTestFraction(String testFraction) {
		this.testFraction = testFraction;
	}

	/**
	 * @return the nFold
	 */
	public String getnFold() {
		return nFold;
	}

	/**
	 * @param nFold the nFold to set
	 */
	public void setnFold(String nFold) {
		this.nFold = nFold;
	}

	/**
	 * @return the moAlpha
	 */
	public String getMoAlpha() {
		return moAlpha;
	}

	/**
	 * @param moAlpha the moAlpha to set
	 */
	public void setMoAlpha(String moAlpha) {
		this.moAlpha = moAlpha;
	}

	/**
	 * @return the moClassWeight
	 */
	public String getMoClassWeight() {
		return moClassWeight;
	}

	/**
	 * @param moClassWeight the moClassWeight to set
	 */
	public void setMoClassWeight(String moClassWeight) {
		this.moClassWeight = moClassWeight;
	}

	/**
	 * @return the moIndexFolder
	 */
	public String getMoIndexFolder() {
		return moIndexFolder;
	}

	/**
	 * @param moIndexFolder the moIndexFolder to set
	 */
	public void setMoIndexFolder(String moIndexFolder) {
		this.moIndexFolder = moIndexFolder;
	}

	/**
	 * @return the moK
	 */
	public String getMoK() {
		return moK;
	}

	/**
	 * @param moK the moK to set
	 */
	public void setMoK(String moK) {
		this.moK = moK;
	}

	/**
	 * @return the moLearnRate
	 */
	public String getMoLearnRate() {
		return moLearnRate;
	}

	/**
	 * @param moLearnRate the moLearnRate to set
	 */
	public void setMoLearnRate(String moLearnRate) {
		this.moLearnRate = moLearnRate;
	}

	/**
	 * @return the moLearningRate
	 */
	public String getMoLearningRate() {
		return moLearningRate;
	}

	/**
	 * @param moLearningRate the moLearningRate to set
	 */
	public void setMoLearningRate(String moLearningRate) {
		this.moLearningRate = moLearningRate;
	}

	/**
	 * @return the moMaxDepth
	 */
	public String getMoMaxDepth() {
		return moMaxDepth;
	}

	/**
	 * @param moMaxDepth the moMaxDepth to set
	 */
	public void setMoMaxDepth(String moMaxDepth) {
		this.moMaxDepth = moMaxDepth;
	}

	/**
	 * @return the moMinImpuritySplit
	 */
	public String getMoMinImpuritySplit() {
		return moMinImpuritySplit;
	}

	/**
	 * @param moMinImpuritySplit the moMinImpuritySplit to set
	 */
	public void setMoMinImpuritySplit(String moMinImpuritySplit) {
		this.moMinImpuritySplit = moMinImpuritySplit;
	}

	/**
	 * @return the moMinRows
	 */
	public String getMoMinRows() {
		return moMinRows;
	}

	/**
	 * @param moMinRows the moMinRows to set
	 */
	public void setMoMinRows(String moMinRows) {
		this.moMinRows = moMinRows;
	}

	/**
	 * @return the moMinSamplesLeaf
	 */
	public String getMoMinSamplesLeaf() {
		return moMinSamplesLeaf;
	}

	/**
	 * @param moMinSamplesLeaf the moMinSamplesLeaf to set
	 */
	public void setMoMinSamplesLeaf(String moMinSamplesLeaf) {
		this.moMinSamplesLeaf = moMinSamplesLeaf;
	}

	/**
	 * @return the moMinSamplesSplit
	 */
	public String getMoMinSamplesSplit() {
		return moMinSamplesSplit;
	}

	/**
	 * @param moMinSamplesSplit the moMinSamplesSplit to set
	 */
	public void setMoMinSamplesSplit(String moMinSamplesSplit) {
		this.moMinSamplesSplit = moMinSamplesSplit;
	}

	/**
	 * @return the moMTries
	 */
	public String getMoMTries() {
		return moMTries;
	}

	/**
	 * @param moMTries the moMTries to set
	 */
	public void setMoMTries(String moMTries) {
		this.moMTries = moMTries;
	}

	/**
	 * @return the moNEstimators
	 */
	public String getMoNEstimators() {
		return moNEstimators;
	}

	/**
	 * @param moNEstimators the moNEstimators to set
	 */
	public void setMoNEstimators(String moNEstimators) {
		this.moNEstimators = moNEstimators;
	}

	/**
	 * @return the moNThread
	 */
	public String getMoNThread() {
		return moNThread;
	}

	/**
	 * @param moNThread the moNThread to set
	 */
	public void setMoNThread(String moNThread) {
		this.moNThread = moNThread;
	}

	/**
	 * @return the moNTrees
	 */
	public String getMoNTrees() {
		return moNTrees;
	}

	/**
	 * @param moNTrees the moNTrees to set
	 */
	public void setMoNTrees(String moNTrees) {
		this.moNTrees = moNTrees;
	}

	/**
	 * @return the moPlot
	 */
	public String getMoPlot() {
		return moPlot;
	}

	/**
	 * @param moPlot the moPlot to set
	 */
	public void setMoPlot(String moPlot) {
		this.moPlot = moPlot;
	}

	/**
	 * @return the moSeed
	 */
	public String getMoSeed() {
		return moSeed;
	}

	/**
	 * @param moSeed the moSeed to set
	 */
	public void setMoSeed(String moSeed) {
		this.moSeed = moSeed;
	}

	/**
	 * @return the moSize
	 */
	public String getMoSize() {
		return moSize;
	}

	/**
	 * @param moSize the moSize to set
	 */
	public void setMoSize(String moSize) {
		this.moSize = moSize;
	}

	/**
	 * @return the moVariance
	 */
	public String getMoVariance() {
		return moVariance;
	}

	/**
	 * @param moVariance the moVariance to set
	 */
	public void setMoVariance(String moVariance) {
		this.moVariance = moVariance;
	}

	/**
	 * @return the moVarImp
	 */
	public String getMoVarImp() {
		return moVarImp;
	}

	/**
	 * @param moVarImp the moVarImp to set
	 */
	public void setMoVarImp(String moVarImp) {
		this.moVarImp = moVarImp;
	}

	/**
	 * @return the cvDemographics
	 */
	public int getCvDemographics() {
		return cvDemographics;
	}

	/**
	 * @param cvDemographics the cvDemographics to set
	 */
	public void setCvDemographics(int cvDemographics) {
		this.cvDemographics = cvDemographics;
	}

	/**
	 * @return the cvExclusionId
	 */
	public int getCvExclusionId() {
		return cvExclusionId;
	}

	/**
	 * @param cvExclusionId the cvExclusionId to set
	 */
	public void setCvExclusionId(int cvExclusionId) {
		this.cvExclusionId = cvExclusionId;
	}

	/**
	 * @return the cvInclusionId
	 */
	public int getCvInclusionId() {
		return cvInclusionId;
	}

	/**
	 * @param cvInclusionId the cvInclusionId to set
	 */
	public void setCvInclusionId(int cvInclusionId) {
		this.cvInclusionId = cvInclusionId;
	}

	/**
	 * @return the cvDemographicsGender
	 */
	public int getCvDemographicsGender() {
		return cvDemographicsGender;
	}

	/**
	 * @param cvDemographicsGender the cvDemographicsGender to set
	 */
	public void setCvDemographicsGender(int cvDemographicsGender) {
		this.cvDemographicsGender = cvDemographicsGender;
	}

	/**
	 * @return the cvDemographicsRace
	 */
	public int getCvDemographicsRace() {
		return cvDemographicsRace;
	}

	/**
	 * @param cvDemographicsRace the cvDemographicsRace to set
	 */
	public void setCvDemographicsRace(int cvDemographicsRace) {
		this.cvDemographicsRace = cvDemographicsRace;
	}

	/**
	 * @return the cvDemographicsEthnicity
	 */
	public int getCvDemographicsEthnicity() {
		return cvDemographicsEthnicity;
	}

	/**
	 * @param cvDemographicsEthnicity the cvDemographicsEthnicity to set
	 */
	public void setCvDemographicsEthnicity(int cvDemographicsEthnicity) {
		this.cvDemographicsEthnicity = cvDemographicsEthnicity;
	}

	/**
	 * @return the cvDemographicsAge
	 */
	public int getCvDemographicsAge() {
		return cvDemographicsAge;
	}

	/**
	 * @param cvDemographicsAge the cvDemographicsAge to set
	 */
	public void setCvDemographicsAge(int cvDemographicsAge) {
		this.cvDemographicsAge = cvDemographicsAge;
	}

	/**
	 * @return the cvDemographicsYear
	 */
	public int getCvDemographicsYear() {
		return cvDemographicsYear;
	}

	/**
	 * @param cvDemographicsYear the cvDemographicsYear to set
	 */
	public void setCvDemographicsYear(int cvDemographicsYear) {
		this.cvDemographicsYear = cvDemographicsYear;
	}

	/**
	 * @return the cvDemographicsMonth
	 */
	public int getCvDemographicsMonth() {
		return cvDemographicsMonth;
	}

	/**
	 * @param cvDemographicsMonth the cvDemographicsMonth to set
	 */
	public void setCvDemographicsMonth(int cvDemographicsMonth) {
		this.cvDemographicsMonth = cvDemographicsMonth;
	}

	/**
	 * @return the cvConditionOcc
	 */
	public int getCvConditionOcc() {
		return cvConditionOcc;
	}

	/**
	 * @param cvConditionOcc the cvConditionOcc to set
	 */
	public void setCvConditionOcc(int cvConditionOcc) {
		this.cvConditionOcc = cvConditionOcc;
	}

	/**
	 * @return the cvConditionOcc365d
	 */
	public int getCvConditionOcc365d() {
		return cvConditionOcc365d;
	}

	/**
	 * @param cvConditionOcc365d the cvConditionOcc365d to set
	 */
	public void setCvConditionOcc365d(int cvConditionOcc365d) {
		this.cvConditionOcc365d = cvConditionOcc365d;
	}

	/**
	 * @return the cvConditionOcc30d
	 */
	public int getCvConditionOcc30d() {
		return cvConditionOcc30d;
	}

	/**
	 * @param cvConditionOcc30d the cvConditionOcc30d to set
	 */
	public void setCvConditionOcc30d(int cvConditionOcc30d) {
		this.cvConditionOcc30d = cvConditionOcc30d;
	}

	/**
	 * @return the cvConditionOccInpt180d
	 */
	public int getCvConditionOccInpt180d() {
		return cvConditionOccInpt180d;
	}

	/**
	 * @param cvConditionOccInpt180d the cvConditionOccInpt180d to set
	 */
	public void setCvConditionOccInpt180d(int cvConditionOccInpt180d) {
		this.cvConditionOccInpt180d = cvConditionOccInpt180d;
	}

	/**
	 * @return the cvConditionEra
	 */
	public int getCvConditionEra() {
		return cvConditionEra;
	}

	/**
	 * @param cvConditionEra the cvConditionEra to set
	 */
	public void setCvConditionEra(int cvConditionEra) {
		this.cvConditionEra = cvConditionEra;
	}

	/**
	 * @return the cvConditionEraEver
	 */
	public int getCvConditionEraEver() {
		return cvConditionEraEver;
	}

	/**
	 * @param cvConditionEraEver the cvConditionEraEver to set
	 */
	public void setCvConditionEraEver(int cvConditionEraEver) {
		this.cvConditionEraEver = cvConditionEraEver;
	}

	/**
	 * @return the cvConditionEraOverlap
	 */
	public int getCvConditionEraOverlap() {
		return cvConditionEraOverlap;
	}

	/**
	 * @param cvConditionEraOverlap the cvConditionEraOverlap to set
	 */
	public void setCvConditionEraOverlap(int cvConditionEraOverlap) {
		this.cvConditionEraOverlap = cvConditionEraOverlap;
	}

	/**
	 * @return the cvConditionGroup
	 */
	public int getCvConditionGroup() {
		return cvConditionGroup;
	}

	/**
	 * @param cvConditionGroup the cvConditionGroup to set
	 */
	public void setCvConditionGroup(int cvConditionGroup) {
		this.cvConditionGroup = cvConditionGroup;
	}

	/**
	 * @return the cvConditionGroupMeddra
	 */
	public int getCvConditionGroupMeddra() {
		return cvConditionGroupMeddra;
	}

	/**
	 * @param cvConditionGroupMeddra the cvConditionGroupMeddra to set
	 */
	public void setCvConditionGroupMeddra(int cvConditionGroupMeddra) {
		this.cvConditionGroupMeddra = cvConditionGroupMeddra;
	}

	/**
	 * @return the cvConditionGroupSnomed
	 */
	public int getCvConditionGroupSnomed() {
		return cvConditionGroupSnomed;
	}

	/**
	 * @param cvConditionGroupSnomed the cvConditionGroupSnomed to set
	 */
	public void setCvConditionGroupSnomed(int cvConditionGroupSnomed) {
		this.cvConditionGroupSnomed = cvConditionGroupSnomed;
	}

	/**
	 * @return the cvDrugExposure
	 */
	public int getCvDrugExposure() {
		return cvDrugExposure;
	}

	/**
	 * @param cvDrugExposure the cvDrugExposure to set
	 */
	public void setCvDrugExposure(int cvDrugExposure) {
		this.cvDrugExposure = cvDrugExposure;
	}

	/**
	 * @return the cvDrugExposure365d
	 */
	public int getCvDrugExposure365d() {
		return cvDrugExposure365d;
	}

	/**
	 * @param cvDrugExposure365d the cvDrugExposure365d to set
	 */
	public void setCvDrugExposure365d(int cvDrugExposure365d) {
		this.cvDrugExposure365d = cvDrugExposure365d;
	}

	/**
	 * @return the cvDrugExposure30d
	 */
	public int getCvDrugExposure30d() {
		return cvDrugExposure30d;
	}

	/**
	 * @param cvDrugExposure30d the cvDrugExposure30d to set
	 */
	public void setCvDrugExposure30d(int cvDrugExposure30d) {
		this.cvDrugExposure30d = cvDrugExposure30d;
	}

	/**
	 * @return the cvDrugEra
	 */
	public int getCvDrugEra() {
		return cvDrugEra;
	}

	/**
	 * @param cvDrugEra the cvDrugEra to set
	 */
	public void setCvDrugEra(int cvDrugEra) {
		this.cvDrugEra = cvDrugEra;
	}

	/**
	 * @return the cvDrugEra365d
	 */
	public int getCvDrugEra365d() {
		return cvDrugEra365d;
	}

	/**
	 * @param cvDrugEra365d the cvDrugEra365d to set
	 */
	public void setCvDrugEra365d(int cvDrugEra365d) {
		this.cvDrugEra365d = cvDrugEra365d;
	}

	/**
	 * @return the cvDrugEra30d
	 */
	public int getCvDrugEra30d() {
		return cvDrugEra30d;
	}

	/**
	 * @param cvDrugEra30d the cvDrugEra30d to set
	 */
	public void setCvDrugEra30d(int cvDrugEra30d) {
		this.cvDrugEra30d = cvDrugEra30d;
	}

	/**
	 * @return the cvDrugEraOverlap
	 */
	public int getCvDrugEraOverlap() {
		return cvDrugEraOverlap;
	}

	/**
	 * @param cvDrugEraOverlap the cvDrugEraOverlap to set
	 */
	public void setCvDrugEraOverlap(int cvDrugEraOverlap) {
		this.cvDrugEraOverlap = cvDrugEraOverlap;
	}

	/**
	 * @return the cvDrugEraEver
	 */
	public int getCvDrugEraEver() {
		return cvDrugEraEver;
	}

	/**
	 * @param cvDrugEraEver the cvDrugEraEver to set
	 */
	public void setCvDrugEraEver(int cvDrugEraEver) {
		this.cvDrugEraEver = cvDrugEraEver;
	}

	/**
	 * @return the cvDrugGroup
	 */
	public int getCvDrugGroup() {
		return cvDrugGroup;
	}

	/**
	 * @param cvDrugGroup the cvDrugGroup to set
	 */
	public void setCvDrugGroup(int cvDrugGroup) {
		this.cvDrugGroup = cvDrugGroup;
	}

	/**
	 * @return the cvProcedureOcc
	 */
	public int getCvProcedureOcc() {
		return cvProcedureOcc;
	}

	/**
	 * @param cvProcedureOcc the cvProcedureOcc to set
	 */
	public void setCvProcedureOcc(int cvProcedureOcc) {
		this.cvProcedureOcc = cvProcedureOcc;
	}

	/**
	 * @return the cvProcedureOcc365d
	 */
	public int getCvProcedureOcc365d() {
		return cvProcedureOcc365d;
	}

	/**
	 * @param cvProcedureOcc365d the cvProcedureOcc365d to set
	 */
	public void setCvProcedureOcc365d(int cvProcedureOcc365d) {
		this.cvProcedureOcc365d = cvProcedureOcc365d;
	}

	/**
	 * @return the cvProcedureOcc30d
	 */
	public int getCvProcedureOcc30d() {
		return cvProcedureOcc30d;
	}

	/**
	 * @param cvProcedureOcc30d the cvProcedureOcc30d to set
	 */
	public void setCvProcedureOcc30d(int cvProcedureOcc30d) {
		this.cvProcedureOcc30d = cvProcedureOcc30d;
	}

	/**
	 * @return the cvProcedureGroup
	 */
	public int getCvProcedureGroup() {
		return cvProcedureGroup;
	}

	/**
	 * @param cvProcedureGroup the cvProcedureGroup to set
	 */
	public void setCvProcedureGroup(int cvProcedureGroup) {
		this.cvProcedureGroup = cvProcedureGroup;
	}

	/**
	 * @return the cvObservation
	 */
	public int getCvObservation() {
		return cvObservation;
	}

	/**
	 * @param cvObservation the cvObservation to set
	 */
	public void setCvObservation(int cvObservation) {
		this.cvObservation = cvObservation;
	}

	/**
	 * @return the cvObservation365d
	 */
	public int getCvObservation365d() {
		return cvObservation365d;
	}

	/**
	 * @param cvObservation365d the cvObservation365d to set
	 */
	public void setCvObservation365d(int cvObservation365d) {
		this.cvObservation365d = cvObservation365d;
	}

	/**
	 * @return the cvObservation30d
	 */
	public int getCvObservation30d() {
		return cvObservation30d;
	}

	/**
	 * @param cvObservation30d the cvObservation30d to set
	 */
	public void setCvObservation30d(int cvObservation30d) {
		this.cvObservation30d = cvObservation30d;
	}

	/**
	 * @return the cvObservationCount365d
	 */
	public int getCvObservationCount365d() {
		return cvObservationCount365d;
	}

	/**
	 * @param cvObservationCount365d the cvObservationCount365d to set
	 */
	public void setCvObservationCount365d(int cvObservationCount365d) {
		this.cvObservationCount365d = cvObservationCount365d;
	}

	/**
	 * @return the cvMeasurement
	 */
	public int getCvMeasurement() {
		return cvMeasurement;
	}

	/**
	 * @param cvMeasurement the cvMeasurement to set
	 */
	public void setCvMeasurement(int cvMeasurement) {
		this.cvMeasurement = cvMeasurement;
	}

	/**
	 * @return the cvMeasurement365d
	 */
	public int getCvMeasurement365d() {
		return cvMeasurement365d;
	}

	/**
	 * @param cvMeasurement365d the cvMeasurement365d to set
	 */
	public void setCvMeasurement365d(int cvMeasurement365d) {
		this.cvMeasurement365d = cvMeasurement365d;
	}

	/**
	 * @return the cvMeasurement30d
	 */
	public int getCvMeasurement30d() {
		return cvMeasurement30d;
	}

	/**
	 * @param cvMeasurement30d the cvMeasurement30d to set
	 */
	public void setCvMeasurement30d(int cvMeasurement30d) {
		this.cvMeasurement30d = cvMeasurement30d;
	}

	/**
	 * @return the cvMeasurementCount365d
	 */
	public int getCvMeasurementCount365d() {
		return cvMeasurementCount365d;
	}

	/**
	 * @param cvMeasurementCount365d the cvMeasurementCount365d to set
	 */
	public void setCvMeasurementCount365d(int cvMeasurementCount365d) {
		this.cvMeasurementCount365d = cvMeasurementCount365d;
	}

	/**
	 * @return the cvMeasurementBelow
	 */
	public int getCvMeasurementBelow() {
		return cvMeasurementBelow;
	}

	/**
	 * @param cvMeasurementBelow the cvMeasurementBelow to set
	 */
	public void setCvMeasurementBelow(int cvMeasurementBelow) {
		this.cvMeasurementBelow = cvMeasurementBelow;
	}

	/**
	 * @return the cvMeasurementAbove
	 */
	public int getCvMeasurementAbove() {
		return cvMeasurementAbove;
	}

	/**
	 * @param cvMeasurementAbove the cvMeasurementAbove to set
	 */
	public void setCvMeasurementAbove(int cvMeasurementAbove) {
		this.cvMeasurementAbove = cvMeasurementAbove;
	}

	/**
	 * @return the cvConceptCounts
	 */
	public int getCvConceptCounts() {
		return cvConceptCounts;
	}

	/**
	 * @param cvConceptCounts the cvConceptCounts to set
	 */
	public void setCvConceptCounts(int cvConceptCounts) {
		this.cvConceptCounts = cvConceptCounts;
	}

	/**
	 * @return the cvRiskScores
	 */
	public int getCvRiskScores() {
		return cvRiskScores;
	}

	/**
	 * @param cvRiskScores the cvRiskScores to set
	 */
	public void setCvRiskScores(int cvRiskScores) {
		this.cvRiskScores = cvRiskScores;
	}

	/**
	 * @return the cvRiskScoresCharlson
	 */
	public int getCvRiskScoresCharlson() {
		return cvRiskScoresCharlson;
	}

	/**
	 * @param cvRiskScoresCharlson the cvRiskScoresCharlson to set
	 */
	public void setCvRiskScoresCharlson(int cvRiskScoresCharlson) {
		this.cvRiskScoresCharlson = cvRiskScoresCharlson;
	}

	/**
	 * @return the cvRiskScoresDcsi
	 */
	public int getCvRiskScoresDcsi() {
		return cvRiskScoresDcsi;
	}

	/**
	 * @param cvRiskScoresDcsi the cvRiskScoresDcsi to set
	 */
	public void setCvRiskScoresDcsi(int cvRiskScoresDcsi) {
		this.cvRiskScoresDcsi = cvRiskScoresDcsi;
	}

	/**
	 * @return the cvRiskScoresChads2
	 */
	public int getCvRiskScoresChads2() {
		return cvRiskScoresChads2;
	}

	/**
	 * @param cvRiskScoresChads2 the cvRiskScoresChads2 to set
	 */
	public void setCvRiskScoresChads2(int cvRiskScoresChads2) {
		this.cvRiskScoresChads2 = cvRiskScoresChads2;
	}

	/**
	 * @return the cvRiskScoresChads2vasc
	 */
	public int getCvRiskScoresChads2vasc() {
		return cvRiskScoresChads2vasc;
	}

	/**
	 * @param cvRiskScoresChads2vasc the cvRiskScoresChads2vasc to set
	 */
	public void setCvRiskScoresChads2vasc(int cvRiskScoresChads2vasc) {
		this.cvRiskScoresChads2vasc = cvRiskScoresChads2vasc;
	}

	/**
	 * @return the cvInteractionYear
	 */
	public int getCvInteractionYear() {
		return cvInteractionYear;
	}

	/**
	 * @param cvInteractionYear the cvInteractionYear to set
	 */
	public void setCvInteractionYear(int cvInteractionYear) {
		this.cvInteractionYear = cvInteractionYear;
	}

	/**
	 * @return the cvInteractionMonth
	 */
	public int getCvInteractionMonth() {
		return cvInteractionMonth;
	}

	/**
	 * @param cvInteractionMonth the cvInteractionMonth to set
	 */
	public void setCvInteractionMonth(int cvInteractionMonth) {
		this.cvInteractionMonth = cvInteractionMonth;
	}
}
