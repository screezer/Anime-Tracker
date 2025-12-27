
import { createClient } from '@supabase/supabase-js';
import { GraphQLClient, gql } from 'graphql-request';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ANILIST_API_URL = 'https://graphql.anilist.co';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const gqlClient = new GraphQLClient(ANILIST_API_URL);

// --- Status Mapping Helpers ---
const STATUS_MAP: Record<string, string> = {
    'To watch': 'TO_WATCH',
    'Planning': 'PLANNING',
    'Dropped': 'DROPPED',
    'On-Hold': 'ON_HOLD',
    'Completed': 'COMPLETED'
};

function getAniListId(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/anilist\.co\/anime\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

const SCRAPE_QUERY = gql`
  query ($year: Int, $page: Int) {
    Page(page: $page, perPage: 50) {
      pageInfo {
        hasNextPage
        total
      }
      media(seasonYear: $year, type: ANIME) {
        id
        idMal
        title { romaji english native }
        description
        bannerImage
        coverImage { extraLarge large medium }
        startDate { year month day }
        endDate { year month day }
        status
        episodes
        duration
        genres
        averageScore
        popularity
        favourites
        studios(isMain: true) { nodes { name } }
        source
        siteUrl
        format
        season
        seasonYear
        isAdult
        relations {
          edges {
            relationType
            node {
              id
              title { romaji english }
              coverImage { medium }
              status
              format
            }
          }
        }
      }
    }
  }
`;

function formatDate(date: { year: number; month: number; day: number }): string | null {
    if (!date || !date.year) return null;
    return `${date.year}-${String(date.month || 1).padStart(2, '0')}-${String(date.day || 1).padStart(2, '0')}`;
}

async function scrape() {
    const startYear = 2000;
    const endYear = 2030;

    // 1. Read export.json to build user status map
    console.log('📖 Loading local export.json...');
    const exportPath = path.join(process.cwd(), 'export.json');
    let userStatusMap: Record<number, string> = {};

    try {
        const jsonData = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
        for (const category in jsonData) {
            const status = STATUS_MAP[category] || 'UNKNOWN';
            jsonData[category].forEach((item: any) => {
                const alId = getAniListId(item.al);
                if (alId) userStatusMap[alId] = status;
            });
        }
        console.log(`✅ Loaded ${Object.keys(userStatusMap).length} user status entries.`);
    } catch (e) {
        console.error('❌ Failed to read export.json. Proceeding without user sync.');
    }

    // 2. Clear DB
    console.log('🧹 Clearing existing database records...');
    await supabase.from('user_anime_lists').delete().neq('anime_id', 0);
    await supabase.from('animes').delete().neq('id', 0);
    console.log('✅ Database purged.');

    console.log(`🚀 Starting Global Scrape: ${startYear} - ${endYear}`);

    for (let year = startYear; year <= endYear; year++) {
        let hasNextPage = true;
        let page = 1;

        console.log(`\n--- Processing Year: ${year} ---`);

        while (hasNextPage) {
            console.log(`  Fetching Page ${page}...`);
            try {
                const data: any = await gqlClient.request(SCRAPE_QUERY, { year, page });
                const mediaList = data.Page.media;

                if (mediaList.length === 0) {
                    hasNextPage = false;
                    continue;
                }

                const animeItems = [];
                const userListEntries = [];

                for (const m of mediaList) {
                    animeItems.push({
                        id: m.id,
                        title_romaji: m.title.romaji,
                        title_english: m.title.english || m.title.romaji,
                        title_native: m.title.native,
                        description: m.description,
                        banner_image: m.bannerImage,
                        cover_image: m.coverImage.extraLarge || m.coverImage.large,
                        start_date: formatDate(m.startDate),
                        end_date: formatDate(m.endDate),
                        status: m.status,
                        episodes: m.episodes,
                        duration: m.duration,
                        genres: m.genres,
                        average_score: m.averageScore,
                        popularity: m.popularity,
                        favourites: m.favourites,
                        studios: m.studios.nodes.map((s: any) => s.name),
                        source: m.source,
                        mal_id: m.idMal,
                        anilist_url: m.siteUrl,
                        format: m.format,
                        season: m.season,
                        season_year: m.seasonYear,
                        is_adult: m.isAdult,
                        ustatus: userStatusMap[m.id] || null,
                        relations: m.relations?.edges?.map((e: any) => ({
                            id: e.node.id,
                            type: e.relationType,
                            title: e.node.title.english || e.node.title.romaji,
                            image: e.node.coverImage.medium,
                            status: e.node.status,
                            format: e.node.format
                        })) || []
                    });

                    // Check if this anime exists in user's export.json
                    if (userStatusMap[m.id]) {
                        userListEntries.push({
                            anime_id: m.id,
                            status: userStatusMap[m.id]
                        });
                    }
                }

                // Upsert to DB
                const { error: animeError } = await supabase.from('animes').upsert(animeItems);
                if (animeError) console.error(`  ❌ Anime Error on page ${page}:`, animeError.message);

                if (userListEntries.length > 0) {
                    const { error: userError } = await supabase.from('user_anime_lists').upsert(userListEntries);
                    if (userError) console.error(`  ❌ User Sync Error on page ${page}:`, userError.message);
                    else console.log(`  🔗 Auto-linked ${userListEntries.length} items to your list`);
                }

                console.log(`  ✅ Synced ${animeItems.length} entries`);

                hasNextPage = data.Page.pageInfo.hasNextPage;
                page++;

                await new Promise(resolve => setTimeout(resolve, 800));

            } catch (err: any) {
                console.error(`  ❌ Fatal Error on page ${page}:`, err.message);
                await new Promise(resolve => setTimeout(resolve, 5000));
                if (err.message.includes('429')) continue;
                break;
            }
        }
    }

    console.log('\n✨ Global Scrape & User Sync Finished.');
}

scrape();
