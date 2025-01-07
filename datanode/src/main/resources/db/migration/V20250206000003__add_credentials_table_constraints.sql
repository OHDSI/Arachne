ALTER TABLE credentials
    ADD CONSTRAINT fk_users_id FOREIGN KEY (user_id) REFERENCES users(id),
    ALTER COLUMN credential_type SET NOT NULL,
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN data SET NOT NULL;
