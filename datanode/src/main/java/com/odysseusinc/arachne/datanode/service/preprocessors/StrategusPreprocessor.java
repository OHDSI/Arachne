/*******************************************************************************
 * Copyright 2023 Odysseus Data Services, Inc.
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
 *******************************************************************************/
package com.odysseusinc.arachne.datanode.service.preprocessors;

import com.odysseusinc.arachne.commons.annotations.PreprocessorComponent;
import com.odysseusinc.arachne.commons.service.preprocessor.Preprocessor;
import com.odysseusinc.arachne.commons.utils.CommonFileUtils;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.ohdsi.sql.SqlRender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;

@PreprocessorComponent(contentType = CommonFileUtils.TYPE_STRATEGUS_JSON)
public class StrategusPreprocessor implements Preprocessor<Analysis> {

    private static final Logger log = LoggerFactory.getLogger(StrategusPreprocessor.class);

    private static final String RENV_RESOURCE = "/strategus/renv.lock";
    private static final String RUNNER = "/strategus/runAnalysis.R";
    private static final String EXECUTABLE = "runAnalysis.R";
    private static final String RENV_LOCK = "renv.lock";

    @Override
    public void preprocess(Analysis analysis, File file) {
        try {
            writeFile(analysis, RENV_LOCK, readResource(RENV_RESOURCE));
            String runnerCode = SqlRender.renderSql(readResource(RUNNER), new String[]{"studyJson"}, new String[]{file.getName()});
            writeFile(analysis, EXECUTABLE, runnerCode);
            analysis.setExecutableFileName(EXECUTABLE);
        } catch (IOException e) {
            log.error("Failed to preprocess Strategus JSON", e);
            throw new UncheckedIOException(e);
        }
    }

    private void writeFile(Analysis analysis, String fileName, String content) {
        File file = new File(analysis.getSourceFolder(), fileName);
        try {
            FileUtils.write(file, content, StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("Failed to preprocess Strategus JSON", e);
            throw new UncheckedIOException(e);
        }
    }

    private String readResource(String path) throws IOException {
        return IOUtils.resourceToString(path, StandardCharsets.UTF_8);
    }
}
