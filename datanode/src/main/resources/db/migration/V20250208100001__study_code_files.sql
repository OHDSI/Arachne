-- DB-backed codeToRun.R (Option B): source of truth in Postgres, synced to container /workspace.
-- Key: (study_package_id, image_tag, path). version for optimistic concurrency.

CREATE TABLE study_code_files
(
    id                BIGSERIAL PRIMARY KEY,
    study_package_id  BIGINT       NOT NULL REFERENCES study_packages (id) ON UPDATE CASCADE ON DELETE CASCADE,
    image_tag         VARCHAR(128) NOT NULL,
    path              VARCHAR(512) NOT NULL DEFAULT 'codeToRun.R',
    content           TEXT         NOT NULL,
    version           INT          NOT NULL DEFAULT 0,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT uq_study_code_files_package_tag_path UNIQUE (study_package_id, image_tag, path)
);

CREATE INDEX idx_study_code_files_package_tag ON study_code_files (study_package_id, image_tag);

COMMENT ON TABLE study_code_files IS 'Persistent code files (e.g. codeToRun.R) per study package and image tag; synced to container /workspace';
