UPDATE analyses a
SET initial_state_id = (SELECT journal.id
                        FROM analysis_state_journal journal
                        WHERE journal.analysis_id = a.id
                          AND journal.date = (SELECT MIN(date)
                                              FROM analysis_state_journal
                                              WHERE analysis_id = a.id)
                        LIMIT 1);

UPDATE analyses a
SET current_state_id = (SELECT journal.id
                        FROM analysis_state_journal journal
                        WHERE journal.analysis_id = a.id
                          AND journal.date = (SELECT MAX(date)
                                              FROM analysis_state_journal
                                              WHERE analysis_id = a.id)
                        LIMIT 1);
