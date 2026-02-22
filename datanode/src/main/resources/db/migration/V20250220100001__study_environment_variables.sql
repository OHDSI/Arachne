/*
 * Study environment variables: key-value pairs injected into study Docker containers at run time.
 * Values are stored encrypted. Used by codeToRun.R via Sys.getenv().
 */
CREATE TABLE study_environment_variables
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(512) NOT NULL,
    value      TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT uq_study_env_var_name UNIQUE (name)
);

CREATE INDEX idx_study_env_var_name ON study_environment_variables (name);

COMMENT ON TABLE study_environment_variables IS 'Environment variables injected into study containers; values stored encrypted';
COMMENT ON COLUMN study_environment_variables.name IS 'Variable name (e.g. DB_PASSWORD); must be valid env var name';
COMMENT ON COLUMN study_environment_variables.value IS 'Variable value (stored encrypted at rest)';
