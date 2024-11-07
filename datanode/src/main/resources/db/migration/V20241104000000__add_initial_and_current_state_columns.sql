ALTER TABLE analyses
    ADD COLUMN initial_state_id BIGINT,
    ADD COLUMN current_state_id BIGINT;