ALTER TABLE analyses ADD COLUMN state VARCHAR(255);

UPDATE analyses
SET state = CASE
                WHEN aj.state = 'CREATED' THEN 'INITIALIZE'
                WHEN aj.state = 'EXECUTION_FAILURE' THEN 'FAILED'
                WHEN aj.state = 'EXECUTING' THEN 'EXECUTE'
                WHEN aj.state = 'EXECUTED' THEN 'COMPLETED'
                WHEN aj.state = 'ABORTING' THEN 'ABORT'
                WHEN aj.state = 'ABORT_FAILURE' THEN 'FAILED'
                ELSE aj.state
    END
FROM analysis_state_journal aj
WHERE analyses.current_state_id = aj.id;