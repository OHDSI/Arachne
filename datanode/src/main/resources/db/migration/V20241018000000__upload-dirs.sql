CREATE TABLE upload (
  name VARCHAR NOT NULL,
  analysis_id BIGINT NULL REFERENCES analyses(id),
  user_id BIGINT NULL REFERENCES users(id)
);

