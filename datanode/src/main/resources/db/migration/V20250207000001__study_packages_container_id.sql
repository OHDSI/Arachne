-- Store Docker container id when a study is "open" (container running for run/execute).
ALTER TABLE study_packages ADD COLUMN IF NOT EXISTS container_id VARCHAR(128) NULL;
COMMENT ON COLUMN study_packages.container_id IS 'Docker container id when study is opened for run (working dir /code in image)';
