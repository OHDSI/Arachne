DO
$$
    DECLARE
        user_record   RECORD;
        credential_id UUID;
        currenttime   timestamp without time zone;
    BEGIN
        SELECT CURRENT_TIMESTAMP::TIMESTAMP WITHOUT TIME ZONE
        INTO currenttime;

        FOR user_record IN  SELECT id AS user_id, username, password
                            FROM users
            LOOP
                credential_id := gen_random_uuid();

                INSERT INTO credentials (id, timestamp, user_id, credential_type, data)
                VALUES (credential_id, currenttime, user_record.user_id, 'BASIC', user_record.password);
            END LOOP;
    END
$$;
