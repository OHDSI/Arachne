ALTER TABLE analysis_state_journal
    ADD COLUMN stage VARCHAR(255);

ALTER TABLE analysis_state_journal
    ADD COLUMN error VARCHAR(255);

ALTER TABLE analysis_state_journal
    ADD COLUMN command VARCHAR(255);