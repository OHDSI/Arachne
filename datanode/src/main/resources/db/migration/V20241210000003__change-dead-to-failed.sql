UPDATE analyses
SET state = 'FAILED'
WHERE analyses.state = 'DEAD';