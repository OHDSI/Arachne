/*
 * Copyright 2026 Odysseus Data Services/EPAM, Darwin EU, OHDSI
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
 * limitations.
 */

package com.odysseusinc.arachne.datanode.service.study;

import com.odysseusinc.arachne.datanode.exception.ResourceConflictException;
import com.odysseusinc.arachne.datanode.exception.ResourceNotFoundException;
import com.odysseusinc.arachne.datanode.model.study.StudyCodeFile;
import com.odysseusinc.arachne.datanode.model.study.StudyPackage;
import com.odysseusinc.arachne.datanode.repository.StudyCodeFileRepository;
import com.odysseusinc.arachne.datanode.repository.StudyPackageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CodeFileServiceTest {

    private static final Long STUDY_PACKAGE_ID = 1L;
    private static final String IMAGE_TAG = "main";
    private static final String PATH = "codeToRun.R";

    @Mock
    private StudyCodeFileRepository codeFileRepository;

    @Mock
    private StudyPackageRepository studyPackageRepository;

    @Mock
    private StudyContainerService containerService;

    private CodeFileService service;

    @BeforeEach
    void setUp() {
        service = new CodeFileService(codeFileRepository, studyPackageRepository, containerService);
    }

    @Test
    void getOrSeedCodeFile_returns_existing_content_and_version() {
        StudyPackage pkg = new StudyPackage();
        pkg.setId(STUDY_PACKAGE_ID);
        StudyCodeFile existing = new StudyCodeFile();
        existing.setContent("existing content");
        existing.setVersion(3);
        when(codeFileRepository.findByStudyPackageIdAndImageTagAndPath(STUDY_PACKAGE_ID, IMAGE_TAG, PATH))
                .thenReturn(Optional.of(existing));

        CodeFileService.CodeFileContent result = service.getOrSeedCodeFile(STUDY_PACKAGE_ID, IMAGE_TAG, PATH);

        assertThat(result.getContent()).isEqualTo("existing content");
        assertThat(result.getVersion()).isEqualTo(3);
        verify(codeFileRepository).findByStudyPackageIdAndImageTagAndPath(STUDY_PACKAGE_ID, IMAGE_TAG, PATH);
    }

    @Test
    void getOrSeedCodeFile_seeds_from_image_when_not_present() {
        when(codeFileRepository.findByStudyPackageIdAndImageTagAndPath(STUDY_PACKAGE_ID, IMAGE_TAG, PATH))
                .thenReturn(Optional.empty());
        StudyPackage pkg = new StudyPackage();
        pkg.setId(STUDY_PACKAGE_ID);
        pkg.setName("team/study");
        pkg.setVersion(IMAGE_TAG);
        pkg.setCatalogAddress("https://reg.azurecr.io");
        when(studyPackageRepository.findById(STUDY_PACKAGE_ID)).thenReturn(Optional.of(pkg));
        when(containerService.readDefaultCodeFromImage(any())).thenReturn("default from image");
        when(codeFileRepository.save(any(StudyCodeFile.class))).thenAnswer(inv -> {
            StudyCodeFile f = inv.getArgument(0);
            f.setId(10L);
            return f;
        });

        CodeFileService.CodeFileContent result = service.getOrSeedCodeFile(STUDY_PACKAGE_ID, IMAGE_TAG, PATH);

        assertThat(result.getContent()).isEqualTo("default from image");
        assertThat(result.getVersion()).isEqualTo(0);
        verify(containerService).readDefaultCodeFromImage("reg.azurecr.io/team/study:main");
        verify(codeFileRepository).save(any(StudyCodeFile.class));
    }

    @Test
    void getOrSeedCodeFile_on_concurrent_seed_rereads_and_returns() {
        when(codeFileRepository.findByStudyPackageIdAndImageTagAndPath(STUDY_PACKAGE_ID, IMAGE_TAG, PATH))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(createFile("other content", 0)));
        StudyPackage pkg = new StudyPackage();
        pkg.setId(STUDY_PACKAGE_ID);
        pkg.setName("team/study");
        pkg.setVersion(IMAGE_TAG);
        pkg.setCatalogAddress("https://reg.azurecr.io");
        when(studyPackageRepository.findById(STUDY_PACKAGE_ID)).thenReturn(Optional.of(pkg));
        when(containerService.readDefaultCodeFromImage(any())).thenReturn("default");
        when(codeFileRepository.save(any(StudyCodeFile.class))).thenThrow(new DataIntegrityViolationException("duplicate"));

        CodeFileService.CodeFileContent result = service.getOrSeedCodeFile(STUDY_PACKAGE_ID, IMAGE_TAG, PATH);

        assertThat(result.getContent()).isEqualTo("other content");
        assertThat(result.getVersion()).isEqualTo(0);
    }

    @Test
    void getOrSeedCodeFile_throws_when_study_package_not_found() {
        when(codeFileRepository.findByStudyPackageIdAndImageTagAndPath(STUDY_PACKAGE_ID, IMAGE_TAG, PATH))
                .thenReturn(Optional.empty());
        when(studyPackageRepository.findById(STUDY_PACKAGE_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getOrSeedCodeFile(STUDY_PACKAGE_ID, IMAGE_TAG, PATH))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Study package not found");
    }

    @Test
    void updateContentIfVersionMatches_returns_new_version_when_match() {
        when(codeFileRepository.updateContentIfVersionMatches(STUDY_PACKAGE_ID, IMAGE_TAG, PATH, "new content", 2))
                .thenReturn(1);
        StudyCodeFile updated = createFile("new content", 3);
        when(codeFileRepository.findByStudyPackageIdAndImageTagAndPath(STUDY_PACKAGE_ID, IMAGE_TAG, PATH))
                .thenReturn(Optional.of(updated));

        int newVersion = service.updateContentIfVersionMatches(STUDY_PACKAGE_ID, IMAGE_TAG, PATH, "new content", 2);

        assertThat(newVersion).isEqualTo(3);
    }

    @Test
    void updateContentIfVersionMatches_throws_409_with_current_version_when_mismatch() {
        when(codeFileRepository.updateContentIfVersionMatches(STUDY_PACKAGE_ID, IMAGE_TAG, PATH, "new content", 2))
                .thenReturn(0);
        StudyCodeFile current = createFile("current content", 5);
        when(codeFileRepository.findByStudyPackageIdAndImageTagAndPath(STUDY_PACKAGE_ID, IMAGE_TAG, PATH))
                .thenReturn(Optional.of(current));

        assertThatThrownBy(
                () -> service.updateContentIfVersionMatches(STUDY_PACKAGE_ID, IMAGE_TAG, PATH, "new content", 2))
                .isInstanceOf(ResourceConflictException.class)
                .hasMessageContaining("modified by another update")
                .satisfies(ex -> assertThat(((ResourceConflictException) ex).getErrors()).containsEntry("version", 5));
    }

    @Test
    void syncCodeToRunningContainer_delegates_to_container_service() {
        service.syncCodeToRunningContainer("cid-1", "script content");
        verify(containerService).syncCodeToRunningContainer(eq("cid-1"), eq("script content"));
    }

    private static StudyCodeFile createFile(String content, int version) {
        StudyCodeFile f = new StudyCodeFile();
        f.setContent(content);
        f.setVersion(version);
        return f;
    }
}
