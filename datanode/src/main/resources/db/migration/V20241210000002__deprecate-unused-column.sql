ALTER TABLE analysis_state_journal ALTER COLUMN state DROP NOT NULL;
COMMENT ON COLUMN analysis_state_journal.state IS 'Deprecated. This field is no longer in active use.';
COMMENT ON COLUMN analyses.error IS 'Deprecated. This field is no longer in active use.';
COMMENT ON COLUMN analyses.stage IS 'Deprecated. This field is no longer in active use.';
