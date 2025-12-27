import { supabase } from '@/lib/supabaseClient';
import { UserAnimeStatus } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // 1. Fetch Data
    const { data: animeList } = await supabase.from('user_anime_lists').select('status, anime_id');
    const { data: animeDetails } = await supabase.from('animes').select('id, duration, episodes, genres');
    const { data: logs } = await supabase.from('system_logs').select('*').order('created_at', { ascending: false }).limit(10);

    // Fetch Total Global Entries
    const { count: globalTotal } = await supabase.from('animes').select('*', { count: 'exact', head: true });

    // 2. Data Processing
    const total = animeList?.length || 0;
    const statusCounts: Record<string, number> = {};
    animeList?.forEach(item => {
        statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });

    // Calculate Total Time (Minutes)
    let totalMinutes = 0;
    animeList?.filter(a => a.status === 'COMPLETED').forEach(item => {
        const details = animeDetails?.find(d => d.id === item.anime_id);
        if (details) {
            totalMinutes += (details.episodes || 12) * (details.duration || 24);
        }
    });
    const daysWatched = (totalMinutes / 1440).toFixed(1);

    // Calculate Genre Distribution
    const genrePower: Record<string, number> = {};
    animeList?.filter(a => a.status === 'COMPLETED').forEach(item => {
        const details = animeDetails?.find(d => d.id === item.anime_id);
        details?.genres?.forEach(g => {
            genrePower[g] = (genrePower[g] || 0) + 1;
        });
    });
    const topGenres = Object.entries(genrePower).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return (
        <div className="min-h-screen p-6 md:p-12 space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-white tracking-tighter">System Intel</h1>
                    <p className="text-text-muted text-lg">Real-time repository analytics and health monitoring.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-surface border border-border rounded-xl text-xs font-mono text-text-muted flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        DATABASE SYNCED
                    </div>
                </div>
            </header>

            {/* HIGH DENSITY STATS */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard label="Global Archive" value={globalTotal || 0} sub="Units synced" accent="primary" />
                <StatCard label="Personal Library" value={total} sub="Owned units" accent="success" />
                <StatCard label="Temporal Progress" value={`${daysWatched}d`} sub="Time watched" accent="warning" />
                <StatCard label="Active Sessions" value={statusCounts['TO_WATCH'] || 0} sub="Currently watching" accent="primary" />
                <StatCard label="Finalized Data" value={statusCounts['COMPLETED'] || 0} sub="Finished items" accent="success" />
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* ACTIVITY LOG */}
                <section className="xl:col-span-2 space-y-6">
                    <div className="bg-surface border border-border rounded-3xl p-8 relative overflow-hidden h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="h-4 w-4 rounded bg-primary/20 flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                </span>
                                Transmission Feed
                            </h3>
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Live stream</span>
                        </div>

                        <div className="space-y-4">
                            {logs?.map((log) => (
                                <div key={log.id} className="group relative pl-6 pb-6 border-l border-border last:pb-0">
                                    <div className="absolute left-[-5px] top-1.5 h-2 w-2 rounded-full bg-border group-hover:bg-primary transition-colors" />
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-bold text-text-main">{log.description}</div>
                                            <div className="text-[10px] font-mono text-text-muted uppercase">{log.event_type}</div>
                                        </div>
                                        <div className="text-[10px] font-mono text-text-muted whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!logs?.length && (
                                <div className="text-center py-12 text-text-muted italic">No activity recorded yet.</div>
                            )}
                        </div>
                    </div>
                </section>

                {/* DISTRIBUTION */}
                <section className="space-y-6">
                    <div className="bg-surface border border-border rounded-3xl p-8 space-y-8">
                        <h3 className="text-lg font-black text-white uppercase tracking-wider">Sector Weights</h3>
                        <div className="space-y-6">
                            {topGenres.map(([name, count]) => {
                                const percentage = Math.round((count / (statusCounts['COMPLETED'] || 1)) * 100);
                                return (
                                    <div key={name} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                                            <span className="text-text-main">{name}</span>
                                            <span className="text-text-muted">{count} UNITS</span>
                                        </div>
                                        <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                                            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8">
                        <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">PRO TIP</h4>
                        <p className="text-sm text-primary/80 leading-relaxed font-medium">
                            Use the Sync Engine regularly to maintain repository integrity and discover new intel through neural suggestions.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatCard({ label, value, sub, accent }: { label: string, value: string | number, sub: string, accent: string }) {
    const accents: Record<string, string> = {
        primary: 'text-primary shadow-[0_0_15px_rgba(37,99,235,0.3)]',
        success: 'text-success shadow-[0_0_15px_rgba(5,150,105,0.3)]',
        warning: 'text-warning shadow-[0_0_15px_rgba(217,119,6,0.3)]',
    };

    return (
        <div className="bg-surface border border-border rounded-3xl p-8 group hover:border-primary/50 transition-all">
            <div className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-4">{label}</div>
            <div className={`text-4xl font-extrabold mb-2 tracking-tighter ${accents[accent]}`}>{value}</div>
            <div className="text-sm font-semibold text-text-muted">{sub}</div>
        </div>
    )
}
