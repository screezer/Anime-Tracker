-- Add ustatus column for native library tracking
ALTER TABLE animes ADD COLUMN IF NOT EXISTS ustatus TEXT;

-- Add raw_data column for 100% high-fidelity archive storage
ALTER TABLE animes ADD COLUMN IF NOT EXISTS raw_data JSONB;

-- Add relations column for linked anime (sequels, prequels, etc.)
ALTER TABLE animes ADD COLUMN IF NOT EXISTS relations JSONB DEFAULT '[]'::jsonb;

-- Safety check for is_adult if not already added
ALTER TABLE animes ADD COLUMN IF NOT EXISTS is_adult BOOLEAN DEFAULT FALSE;
