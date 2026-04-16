-- Ensure both roles exist
INSERT INTO roles (id, name) VALUES (nextval('roles_id_seq'), 'ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO roles (id, name) VALUES (nextval('roles_id_seq'), 'ROLE_ADMIN') ON CONFLICT DO NOTHING;

-- Assign ROLE_USER to all existing users who don't already have it
INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE r.name = 'ROLE_USER'
  AND NOT EXISTS (
    SELECT 1 FROM users_roles ur
    WHERE ur.user_id = u.id AND ur.role_id = r.id
  );

-- Auth settings table
CREATE TABLE IF NOT EXISTS auth_settings (
    key   VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL
);

INSERT INTO auth_settings (key, value) VALUES ('self_registration_enabled', 'false') ON CONFLICT DO NOTHING;
INSERT INTO auth_settings (key, value) VALUES ('password_min_length', '8') ON CONFLICT DO NOTHING;
INSERT INTO auth_settings (key, value) VALUES ('password_require_uppercase', 'false') ON CONFLICT DO NOTHING;
INSERT INTO auth_settings (key, value) VALUES ('password_require_lowercase', 'false') ON CONFLICT DO NOTHING;
INSERT INTO auth_settings (key, value) VALUES ('password_require_digit', 'false') ON CONFLICT DO NOTHING;
INSERT INTO auth_settings (key, value) VALUES ('password_require_special_char', 'false') ON CONFLICT DO NOTHING;
