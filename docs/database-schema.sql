-- AnimeTarget Millennium Archive Database Schema
-- Version: 14.0
-- Database: PostgreSQL (Supabase)

-- Main Anime Archive Table
CREATE TABLE IF NOT EXISTS animes (
    id BIGINT PRIMARY KEY,
    title_romaji TEXT NOT NULL,
    title_english TEXT,
    title_native TEXT,
    description TEXT,
    banner_image TEXT,
    cover_image TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT,
    episodes INTEGER,
    duration INTEGER,
    genres TEXT[],
    average_score INTEGER,
    studios TEXT[],
    source TEXT,
    mal_id BIGINT,
    anilist_url TEXT,
    format TEXT,
    season TEXT,
    season_year INTEGER,
    popularity INTEGER,
    favourites INTEGER,
    ustatus TEXT CHECK (ustatus IN ('TO_WATCH', 'PLANNING', 'DROPPED', 'ON_HOLD', 'COMPLETED', 'WATCHING')),
    relations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legacy User Anime Lists (for backward compatibility)
CREATE TABLE IF NOT EXISTS user_anime_lists (
    id BIGSERIAL PRIMARY KEY,
    anime_id BIGINT NOT NULL REFERENCES animes(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('TO_WATCH', 'PLANNING', 'DROPPED', 'ON_HOLD', 'COMPLETED', 'WATCHING')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(anime_id)
);

-- System Logs for Mission Control
CREATE TABLE IF NOT EXISTS system_logs (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    description TEXT,
    meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_animes_ustatus ON animes(ustatus) WHERE ustatus IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_animes_popularity ON animes(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_animes_average_score ON animes(average_score DESC);
CREATE INDEX IF NOT EXISTS idx_animes_genres ON animes USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_animes_title_english ON animes(title_english);
CREATE INDEX IF NOT EXISTS idx_animes_title_romaji ON animes(title_romaji);
CREATE INDEX IF NOT EXISTS idx_user_anime_lists_status ON user_anime_lists(status);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at DESC);

-- Enable Row Level Security (Optional - configure based on your auth setup)
-- ALTER TABLE animes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_anime_lists ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_animes_updated_at
    BEFORE UPDATE ON animes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_anime_lists_updated_at
    BEFORE UPDATE ON user_anime_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
