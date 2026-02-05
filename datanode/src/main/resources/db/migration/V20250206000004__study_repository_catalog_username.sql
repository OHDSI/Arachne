/*
 * Add Study catalog username system setting (from env ARACHNE_DOCKER_REGISTRY_USER; editable in Study Repository settings).
 */

INSERT INTO system_settings (group_id, label, name, value, type)
VALUES (
           (SELECT id FROM system_settings_groups WHERE name = 'study_repository'),
           'Study catalog username',
           'study.catalog.username',
           NULL,
           'text'
       )
ON CONFLICT (name) DO NOTHING;
