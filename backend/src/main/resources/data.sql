-- Fix any rows with zero/null updated_at that cause "Zero date value prohibited"
UPDATE tasks SET updated_at = created_at WHERE updated_at IS NULL OR updated_at = '0000-00-00 00:00:00';
UPDATE tasks SET created_at = NOW() WHERE created_at IS NULL OR created_at = '0000-00-00 00:00:00';
