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

import com.odysseusinc.arachne.commons.service.preprocessor.AbstractPreprocessorService;
import com.odysseusinc.arachne.commons.service.preprocessor.PreprocessorRegistry;
import com.odysseusinc.arachne.commons.utils.CommonFileUtils;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Optional;


@Service
public class AnalysisPreprocessorService extends AbstractPreprocessorService<Analysis> {

    @Autowired
    public AnalysisPreprocessorService(PreprocessorRegistry<Analysis> preprocessorRegistry) {

        super(preprocessorRegistry);
    }

    @Override
    protected boolean before(Analysis analysis) {

        File analysisFolder = new File(analysis.getSourceFolder());
        return analysisFolder.exists() && analysisFolder.isDirectory();
    }

    @Override
    protected List<File> getFiles(Analysis analysis) {

        File analysisFolder = new File(analysis.getSourceFolder());
        return CommonFileUtils.getFiles(analysisFolder);
    }

    @Override
    protected Optional<String> getContentType(Analysis analysis, File file) {

        return Optional.of(CommonFileUtils.getContentType(file.getName(), file.getAbsolutePath()));
    }
}
