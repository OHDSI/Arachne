UPDATE analysis_state_journal SET
                                  stage = analyses.stage,
                                  error = analyses.error
FROM analyses WHERE analyses.current_state_id = analysis_state_journal.id;
