import { supabase } from '@/lib/supabaseClient';
import GlobalSearch from '@/components/GlobalSearch';

export const dynamic = 'force-dynamic';

export default async function SearchPage() {
    // We get the IDs of anime already in the user's library
    const { data: userList } = await supabase
        .from('animes')
        .select('id')
        .not('ustatus', 'is', null);

    const userIds = new Set(userList?.map(u => u.id) || []);

    return (
        <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-10">
            <header className="space-y-2">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter shadow-sm">Global Repository</h1>
                <p className="text-text-muted text-lg font-medium">Explore and integrate any unit from the AniList archives.</p>
            </header>

            <GlobalSearch initialUserIds={userIds} />
        </main>
    )
}
