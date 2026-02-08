/*
 * Study run execution metadata and result files.
 * - docker_image: full image (e.g. registry/name:tag) at time of run
 * - study_run_result_files: one row per file from the study output folder (outputFolder in codeToRun.R)
 */

ALTER TABLE study_runs
    ADD COLUMN docker_image VARCHAR(1024);

COMMENT ON COLUMN study_runs.docker_image IS 'Full Docker image (registry/name:tag) used for this run';

CREATE TABLE study_run_result_files
(
    id         BIGSERIAL PRIMARY KEY,
    run_id     BIGINT NOT NULL REFERENCES study_runs (id) ON UPDATE CASCADE ON DELETE CASCADE,
    file_path  VARCHAR(2048) NOT NULL,
    content    BYTEA NOT NULL,
    CONSTRAINT uq_study_run_result_file_run_path UNIQUE (run_id, file_path)
);

CREATE INDEX idx_study_run_result_files_run_id ON study_run_result_files (run_id);

COMMENT ON TABLE study_run_result_files IS 'Files from the study output folder (outputFolder in codeToRun.R) saved after each run';
