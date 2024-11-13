ALTER TABLE analysis_state_journal ADD COLUMN state_backup VARCHAR(255);
UPDATE analysis_state_journal SET state_backup = state;
