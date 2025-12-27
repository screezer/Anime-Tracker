
import { createClient } from '@supabase/supabase-js';
import { GraphQLClient, gql } from 'graphql-request';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// --- Configuration ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ANILIST_API_URL = 'https://graphql.anilist.co';
const JSON_FILE_PATH = path.join(process.cwd(), 'export.json');
const BATCH_SIZE = 50; // AniList Page query limit 
const MIN_DELAY_MS = 2000; // Delay between batches

// --- Type Definitions ---
interface AnimeExport {
  name: string;
  mal: string;
  al: string | null;
}

// Minimal shape for our internal list
interface WorkItem {
  alId: number;
  userStatus: string;
}

// --- Helper Functions ---
function getAniListId(url: string | null): number | null {
  if (!url) return null;
  const match = url.match(/anilist\.co\/anime\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function formatDate(date: { year: number; month: number; day: number }): string | null {
  if (!date || !date.year || !date.month || !date.day) return null;
  const { year, month, day } = date;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function mapStatus(status: string): string {
  switch (status) {
    case 'To watch': return 'TO_WATCH';
    case 'Planning': return 'PLANNING';
    case 'Dropped': return 'DROPPED';
    case 'On-Hold': return 'ON_HOLD';
    case 'Completed': return 'COMPLETED';
    default: return 'UNKNOWN';
  }
}

// --- Main Script Logic ---
async function main() {
  console.log('Starting SUPERCHARGED data ingestion script...');

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase URL or Service Key is not defined in environment variables.');
  }

  // Initialize clients
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const gqlClient = new GraphQLClient(ANILIST_API_URL);

  // Read and parse the local JSON file
  const jsonData = JSON.parse(fs.readFileSync(JSON_FILE_PATH, 'utf-8'));

  // 1. CLEAR OLD DATA
  console.log('Clearing old data (User List)...');
  const { error: clearListError } = await supabase.from('user_anime_lists').delete().neq('anime_id', 0);
  if (clearListError) console.error('Error clearing user_anime_lists:', clearListError);
  console.log('Old list data cleared.');

  // 2. Prepare work queue
  const workQueue: WorkItem[] = [];
  const processedIds = new Set<number>();

  for (const category in jsonData) {
    const animeList: AnimeExport[] = jsonData[category];
    const status = mapStatus(category);

    for (const anime of animeList) {
      const alId = getAniListId(anime.al);
      if (alId && !processedIds.has(alId)) {
        workQueue.push({ alId, userStatus: status });
        processedIds.add(alId);
      }
    }
  }

  console.log(`Found ${workQueue.length} unique items to process.`);

  // 3. Batch Process
  // We'll process in chunks of BATCH_SIZE
  const ANIME_QUERY = gql`
    query ($ids: [Int], $page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        media (id_in: $ids, type: ANIME) {
            id
            idMal
            title {
                romaji
                english
                native
            }
            description
            bannerImage
            coverImage {
                extraLarge
                large
                color
            }
            startDate { year month day }
            endDate { year month day }
            status
            episodes
            duration
            genres
            averageScore
            popularity
            favourites
            studios {
                nodes { name }
            }
            source
            siteUrl
            tags {
                name
                description
                rank
            }
            characters (sort: ROLE, perPage: 10) {
                nodes {
                    name { full }
                    image { medium }
                }
            }
        }
      }
    }
  `;

  let successCount = 0;
  let errorCount = 0;

  // Chunking
  for (let i = 0; i < workQueue.length; i += BATCH_SIZE) {
    const chunk = workQueue.slice(i, i + BATCH_SIZE);
    const ids = chunk.map(w => w.alId);

    console.log(`Processing batch ${i / BATCH_SIZE + 1} (IDs: ${ids.length})...`);

    try {
      const apiResponse: any = await gqlClient.request(ANIME_QUERY, { ids: ids, page: 1, perPage: BATCH_SIZE });
      const mediaList = apiResponse.Page.media;

      // Process each media item
      for (const media of mediaList) {
        const workItem = chunk.find(w => w.alId === media.id);
        if (!workItem) continue;

        // Prepare upsert data
        // We'll stick to the KNOWN columns for now to ensure success

        const { error: animeError } = await supabase
          .from('animes')
          .upsert({
            id: media.id,
            title_romaji: media.title.romaji,
            title_english: media.title.english || media.title.romaji,
            description: media.description,
            banner_image: media.bannerImage,
            cover_image: media.coverImage.extraLarge,
            start_date: formatDate(media.startDate),
            end_date: formatDate(media.endDate),
            status: media.status,
            episodes: media.episodes,
            duration: media.duration,
            genres: media.genres,
            average_score: media.averageScore,
            studios: media.studios.nodes.map((s: any) => s.name),
            source: media.source,
            mal_id: media.idMal,
            anilist_url: media.siteUrl,
            // extra_data: media // Ideally we'd do this if column existed, unfortunately we can't easily add it here.
          });

        if (animeError) {
          console.error(`Error upserting anime ${media.id}:`, animeError.message);
          errorCount++;
        } else {
          // Upsert User List
          const { error: listError } = await supabase
            .from('user_anime_lists')
            .upsert({
              anime_id: media.id,
              status: workItem.userStatus,
            }, { onConflict: 'anime_id, status' });

          if (listError) {
            console.error(`Error upserting list ${media.id}:`, listError.message);
            errorCount++;
          } else {
            successCount++;
          }
        }
      }

    } catch (err) {
      console.error('Batch failed:', err);
      errorCount += ids.length;
    }

    await new Promise(resolve => setTimeout(resolve, MIN_DELAY_MS));
  }

  console.log(`\n--- SUPERCHARGED Ingestion Complete ---`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

main().catch(error => {
  console.error('Critical error:', error);
  process.exit(1);
});
