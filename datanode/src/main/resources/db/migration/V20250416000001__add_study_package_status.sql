-- Add status tracking for async Docker image pull
ALTER TABLE study_packages ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'READY';
ALTER TABLE study_packages ADD COLUMN IF NOT EXISTS status_message TEXT;
