UPDATE analysis_state_journal SET state = 'INITIALIZE' WHERE state = 'CREATED';
UPDATE analysis_state_journal SET state = 'FAILED' WHERE state = 'EXECUTION_FAILURE';
UPDATE analysis_state_journal SET state = 'EXECUTE' WHERE state = 'EXECUTING';
UPDATE analysis_state_journal SET state = 'COMPLETED' WHERE state = 'EXECUTED';
UPDATE analysis_state_journal SET state = 'ABORT' WHERE state = 'ABORTING';
UPDATE analysis_state_journal SET state = 'FAILED' WHERE state = 'ABORT_FAILURE';