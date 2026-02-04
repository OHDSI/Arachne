/*
 * Study Repository schema: installed study packages, run history, and results.
 * Supports the Study Repository UI: install/update studies, run script, save results, login (users/credentials already exist).
 */

-- Study packages: one row per installed study (name + version from catalog)
CREATE TABLE study_packages
(
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(512) NOT NULL,
    version        VARCHAR(128) NOT NULL,
    catalog_address VARCHAR(1024),
    script         TEXT,
    installed_at   TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT uq_study_package_name_version UNIQUE (name, version)
);
-- BIGSERIAL already creates study_packages_id_seq

COMMENT ON TABLE study_packages IS 'Installed study packages from the catalog (Study Repository)';
COMMENT ON COLUMN study_packages.script IS 'User-editable run script (e.g. codeToRun.R) saved with the study';

-- Study runs: each run of a study (for hasResults, logs, output path)
CREATE TABLE study_runs
(
    id               BIGSERIAL PRIMARY KEY,
    study_package_id BIGINT NOT NULL REFERENCES study_packages (id) ON UPDATE CASCADE ON DELETE CASCADE,
    status           VARCHAR(32) NOT NULL DEFAULT 'RUNNING',
    started_at       TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    finished_at      TIMESTAMP WITH TIME ZONE,
    result_path      VARCHAR(1024),
    logs             TEXT,
    CONSTRAINT chk_study_run_status CHECK (status IN ('RUNNING', 'COMPLETED', 'FAILED', 'ABORTED'))
);
-- BIGSERIAL already creates study_runs_id_seq

CREATE INDEX idx_study_runs_study_package_id ON study_runs (study_package_id);
CREATE INDEX idx_study_runs_status ON study_runs (status);

COMMENT ON TABLE study_runs IS 'Run history and results for Study Repository studies';

-- Study Repository settings (catalog address and token) in system_settings
INSERT INTO system_settings_groups (label, name)
VALUES ('Study Repository', 'study_repository')
ON CONFLICT (name) DO NOTHING;

INSERT INTO system_settings (group_id, label, name, value, type)
VALUES (
           (SELECT id FROM system_settings_groups WHERE name = 'study_repository'),
           'Study catalog address',
           'study.catalog.address',
           NULL,
           'text'
       )
ON CONFLICT (name) DO NOTHING;

INSERT INTO system_settings (group_id, label, name, value, type)
VALUES (
           (SELECT id FROM system_settings_groups WHERE name = 'study_repository'),
           'Study catalog token',
           'study.catalog.token',
           NULL,
           'password'
       )
ON CONFLICT (name) DO NOTHING;
