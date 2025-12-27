import { Anime, UserAnimeStatus } from '@/types';

export type ChangeType = 'NEW' | 'UPDATE' | 'STATUS_CHANGE' | 'NO_CHANGE';

export interface DiffItem {
    id: number; // AniList ID
    type: ChangeType;
    title: string;
    changes: string[]; // e.g. ["status: TO_WATCH -> COMPLETED", "episodes: 12 -> 24"]
    newData: Partial<Anime>;
    newStatus?: UserAnimeStatus;
}

export interface ImportData {
    name: string;
    mal: string;
    al: string | null;
}

export function calculateDiff(
    importData: Record<string, ImportData[]>, // keys are statuses 'To watch', etc.
    currentDbAnimes: Anime[],
    currentDbList: { anime_id: number, status: UserAnimeStatus }[]
): DiffItem[] {
    const diffs: DiffItem[] = [];
    const processedIds = new Set<number>();

    // Map DB data for fast lookup
    const dbAnimeMap = new Map<number, Anime>();
    currentDbAnimes.forEach(a => dbAnimeMap.set(a.id, a));

    const dbListMap = new Map<number, UserAnimeStatus>();
    currentDbList.forEach(l => dbListMap.set(l.anime_id, l.status));


    // Process JSON
    for (const [category, list] of Object.entries(importData)) {
        const mappedStatus = mapStatus(category);

        for (const item of list) {
            const alId = getAniListId(item.al);
            if (!alId) continue;

            if (processedIds.has(alId)) continue; // Duplicate in JSON?
            processedIds.add(alId);

            const dbAnime = dbAnimeMap.get(alId);
            const dbStatus = dbListMap.get(alId);

            // 1. NEW ENTRY
            if (!dbAnime) {
                diffs.push({
                    id: alId,
                    type: 'NEW',
                    title: item.name,
                    changes: ['New Entry'],
                    newData: { id: alId }, // We will need to fetch details later or usually we assume import triggers fetch
                    newStatus: mappedStatus
                });
                continue;
            }

            // 2. CHECK STATUS CHANGE
            if (dbStatus && dbStatus !== mappedStatus) {
                diffs.push({
                    id: alId,
                    type: 'STATUS_CHANGE',
                    title: dbAnime.title_english || dbAnime.title_romaji,
                    changes: [`Status: ${dbStatus} -> ${mappedStatus}`],
                    newData: dbAnime,
                    newStatus: mappedStatus
                });
                continue;
            }

            // 3. CHECK METADATA UPDATE (Optional, if JSON had metadata we check here. But JSON only has links)
            // For now, our JSON is simple, so we primarily check for 'New' or 'Status Change'.
            // If we fetched rich data in the "Staging" phase, we would compare here.
            // Since we don't have rich data in export.json, "UPDATE" is rare unless we re-fetch from AniList during Diff.
            // Let's keep it simple: If it exists and status matches, it's NO_CHANGE.
        }
    }

    return diffs;
}

function getAniListId(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/anilist\.co\/anime\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

function mapStatus(status: string): UserAnimeStatus {
    switch (status) {
        case 'To watch': return 'TO_WATCH';
        case 'Planning': return 'PLANNING';
        case 'Dropped': return 'DROPPED';
        case 'On-Hold': return 'ON_HOLD';
        case 'Completed': return 'COMPLETED';
        default: return 'UNKNOWN';
    }
}
