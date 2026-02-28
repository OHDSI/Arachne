-- Reusable R code snippets (e.g. database connection, CDM setup).
-- Managed in Settings, inserted into codeToRun.R when running a study.

CREATE TABLE code_snippets
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    content     TEXT         NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT uq_code_snippets_name UNIQUE (name)
);

CREATE INDEX idx_code_snippets_name ON code_snippets (name);

COMMENT ON TABLE code_snippets IS 'Reusable R code snippets for database connections and study configuration';
