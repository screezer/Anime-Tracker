import { supabase } from '@/lib/supabaseClient';
import { Anime, UserAnimeStatus } from '@/types';
import ClientHome from '@/components/ClientHome';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Fetch ALL Data (Dense Admin Mode)
  // We fetch everything because dataset is small (<500).
  // For larger sets, we'd paginate, but Admin UX prioritizes speed.

  // Fetch only anime where ustatus is NOT null (In Library)
  const { data: animeData, error: animeError } = await supabase
    .from('animes')
    .select('*')
    .not('ustatus', 'is', null);

  if (animeError) console.error(animeError);

  // Map to include userStatus prop for ClientHome
  const fullList = animeData?.map(anime => ({
    ...anime,
    userStatus: anime.ustatus
  })) || [];

  if (!fullList || fullList.length === 0) {
    return (
      <main className="min-h-screen p-6 md:p-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Your Library is Empty</h1>
        <p className="text-text-muted mb-8">Start by searching the global database to add anime.</p>
        <Link href="/search" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors">
          Go to Global Search
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Library Control</h1>
        <p className="text-text-muted mt-1">Manage, update, and organize your collection.</p>
      </header>

      <ClientHome initialData={fullList} />
    </main>
  );
}
