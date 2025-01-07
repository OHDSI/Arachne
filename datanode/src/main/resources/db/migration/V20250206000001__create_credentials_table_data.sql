CREATE TABLE credentials
(
    id              uuid PRIMARY KEY,
    timestamp       timestamp without time zone,
    terminated      timestamp without time zone,
    user_id         bigint,
    provider        VARCHAR(50),
    subject         VARCHAR(255),
    credential_type VARCHAR(50),
    data            TEXT,
    CONSTRAINT chk_credential_type CHECK (credential_type IN ('BASIC', 'OIDC'))
);