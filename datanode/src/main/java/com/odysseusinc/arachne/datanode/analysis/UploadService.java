/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.analysis;

import com.odysseusinc.arachne.datanode.exception.BadRequestException;
import com.odysseusinc.arachne.datanode.exception.IllegalOperationException;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.util.ZipUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class UploadService {
	@Value("${files.store.path}")
	private String storageDir;

    @PersistenceContext
	private EntityManager em;

	public static Function<Path, List<Path>> transfer(List<MultipartFile> archive) {
		return dir -> archive.stream().map(file -> {
			try {
				Path path = dir.resolve(Objects.requireNonNull(file.getOriginalFilename()));
				file.transferTo(path);
				return path;
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		}).collect(Collectors.toList());
	}

	@Transactional
	public Upload findUnassigned(String name) {
		Upload upload = find(name);
		Long analysisId = upload.getAnalysisId();
		if (analysisId != null) {
			throw new BadRequestException("Upload [" + name + "] is already attached to analysis " + analysisId);
		}
		return upload;
	}

	@Transactional
	public Upload find(String name) {
		return Optional.ofNullable(em.find(Upload.class, name)).orElseThrow(() ->
				new BadRequestException("Upload not found: [" + name + "]")
		);
	}

	@Transactional
	public UploadDTO uploadZip(User user, List<MultipartFile> archive) {
		MultipartFile zip = ensureExactlyOne(archive);
		return upload(user, zip.getOriginalFilename(), unpack(zip));
	}

	@Transactional
	public UploadDTO uploadFiles(User user, List<MultipartFile> files) {
		return upload(user, UUID.randomUUID().toString(), transfer(files));
	}

	private UploadDTO upload(User user, String name, Function<Path, List<Path>> writeFiles) {
		Path path = Paths.get(storageDir).resolve(timestamp() + "-" + name);
        try {
			Files.createDirectories(path);
		} catch (IOException e) {
			log.error(e.getMessage(), e);
			throw new RuntimeException("Error creating directory [" + path + "]: " + e.getMessage(), e );
		}
		Upload entity = new Upload(name, user, null);
		em.persist(entity);
		List<Path> files = writeFiles.apply(path);
		log.info("User {} [{}] uploaded {} files to [{}]", user.getId(), user.getTitle(), files.size(), path);
		List<String> names = files.stream().map(toRelativePath(path)).collect(Collectors.toList());
		return new UploadDTO(name, names);
	}

	private String timestamp() {
		return Instant.now().toString().replaceAll(":", "-").replaceAll("\\.", "-").replaceAll("Z", "");
	}

	public static <T> List<T> scan(Path path, Function<Path, T> mapper) {
		try (Stream<Path> paths = Files.walk(path)) {
			return paths.filter(Files::isRegularFile).map(mapper).collect(Collectors.toList());
		} catch (IOException e) {
			log.warn("Error listing files in [{}]: {}", path, e.getMessage());
			return Collections.emptyList();
		}
	}

	public static Function<Path, String> toRelativePath(Path path) {
		return file -> path.relativize(file).toString();
	}

	public static Function<Path, List<Path>> unpack(MultipartFile zip) {
		return dir -> {
			try {
				return ZipUtils.processZip(zip.getInputStream(), (name, in) -> {
					Path path = dir.resolve(name);
					FileUtils.copyInputStreamToFile(in, path.toFile());
					return path;
				});
			} catch (IOException e) {
				log.error("Failed to save analysis files for [{}]:", zip.getOriginalFilename(), e);
				throw new IllegalOperationException(e.getMessage());
			}
		};
	}

	public static MultipartFile ensureExactlyOne(List<MultipartFile> archive) {
		return archive.stream().reduce((a, b) -> {
			throw new BadRequestException("Multiple files submitted. Only one zip archive is expected");
		}).orElseThrow(() ->
				new BadRequestException("No files submitted in request")
		);
	}

}
