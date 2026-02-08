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
 * limitations under the License.
 */

package com.odysseusinc.arachne.datanode.repository;

import com.odysseusinc.arachne.datanode.model.study.StudyCodeFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StudyCodeFileRepository extends JpaRepository<StudyCodeFile, Long> {

    Optional<StudyCodeFile> findByStudyPackageIdAndImageTagAndPath(Long studyPackageId, String imageTag, String path);

    /**
     * Optimistic update: set content and increment version only if current version matches.
     * Returns the number of rows updated (0 or 1).
     */
    @Modifying(clearAutomatically = true)
    @Query("UPDATE StudyCodeFile f SET f.content = :content, f.version = f.version + 1, f.updatedAt = current_timestamp " +
            "WHERE f.studyPackage.id = :studyPackageId AND f.imageTag = :imageTag AND f.path = :path AND f.version = :version")
    int updateContentIfVersionMatches(
            @Param("studyPackageId") Long studyPackageId,
            @Param("imageTag") String imageTag,
            @Param("path") String path,
            @Param("content") String content,
            @Param("version") int version);
}
