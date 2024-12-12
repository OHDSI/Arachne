ALTER TABLE analyses
    ADD COLUMN current_state_id BIGINT,
    ADD CONSTRAINT fk_current_state
        FOREIGN KEY (current_state_id) REFERENCES analysis_state_journal(id);

ALTER TABLE analyses
    ADD COLUMN created TIMESTAMP WITHOUT TIME ZONE;
