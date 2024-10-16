/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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
 */

package com.odysseusinc.arachne.datanode.service.impl;

import com.odysseusinc.arachne.commons.service.preprocessor.Preprocessor;
import com.odysseusinc.arachne.commons.service.preprocessor.PreprocessorService;
import com.odysseusinc.arachne.commons.utils.CommonFileUtils;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;


@Service
public class AnalysisPreprocessorService implements PreprocessorService<Analysis> {

    @Autowired
    private List<Preprocessor<Analysis>> preprocessors;

    protected boolean before(Analysis analysis) {
        File analysisFolder = new File(analysis.getSourceFolder());
        return analysisFolder.exists() && analysisFolder.isDirectory();
    }

    protected List<File> getFiles(Analysis analysis) {
        File analysisFolder = new File(analysis.getSourceFolder());
        return CommonFileUtils.getFiles(analysisFolder);
    }

    @Override
    public void runPreprocessor(Analysis analysis) {
        if (before(analysis)) {

            getFiles(analysis).forEach(file -> {
                preprocessors.forEach(preprocessor -> preprocessor.preprocess(analysis, file));
            });
        }
    }

}
