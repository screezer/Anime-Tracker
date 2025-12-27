export interface Anime {
    id: number;
    title_romaji: string;
    title_english: string | null;
    description: string | null;
    banner_image: string | null;
    cover_image: string | null; // extraLarge
    start_date: string | null;
    end_date: string | null;
    status: string | null;
    episodes: number | null;
    duration: number | null;
    genres: string[] | null;
    average_score: number | null;
    studios: string[] | null;
    source: string | null;
    mal_id: number | null;
    anilist_url: string | null;
    format?: string | null;
    season?: string | null;
    season_year?: number | null;
    popularity?: number | null;
    favourites?: number | null;
    ustatus?: UserAnimeStatus | null;
    relations?: any[] | null;
    title_native?: string | null;
}

export type UserAnimeStatus = 'TO_WATCH' | 'PLANNING' | 'DROPPED' | 'ON_HOLD' | 'COMPLETED' | 'UNKNOWN';

export interface UserAnimeList {
    anime_id: number;
    status: UserAnimeStatus;
    user_id?: string; // If we add auth later, but for now ingestion sets it? 
    // Wait, the ingestion script didn't set 'user_id' in 'user_anime_lists' upsert. 
    // Maybe the table defaults to a specific user or auth is disabled/RLS is open? 
    // Or maybe the user is implicit.
    // The table schema isn't fully known, but the script implied only anime_id and status.
    created_at?: string;
    anime?: Anime; // For join queries
}
