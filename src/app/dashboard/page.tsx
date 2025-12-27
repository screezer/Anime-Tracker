import { supabase } from '@/lib/supabaseClient';
import { UserAnimeStatus } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // 1. Fetch Data
    const { data: animeDetails } = await supabase.from('animes').select('id, duration, episodes, genres, ustatus');
    const { data: logs } = await supabase.from('system_logs').select('*').order('created_at', { ascending: false }).limit(10);
    const { count: globalTotal } = await supabase.from('animes').select('*', { count: 'exact', head: true });

    // 2. Data Processing
    const animeList = animeDetails?.filter(a => a.ustatus !== null) || [];
    const total = animeList.length;
    const statusCounts: Record<string, number> = {};
    animeList.forEach(item => {
        const s = item.ustatus as string;
        statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    // Calculate Total Time (Minutes)
    let totalMinutes = 0;
    animeList.filter(a => a.ustatus === 'COMPLETED').forEach(item => {
        totalMinutes += (item.episodes || 12) * (item.duration || 24);
    });
    const daysWatched = (totalMinutes / 1440).toFixed(1);

    // Calculate Genre Distribution
    const genrePower: Record<string, number> = {};
    animeList.filter(a => a.ustatus === 'COMPLETED').forEach(item => {
        item.genres?.forEach((g: string) => {
            genrePower[g] = (genrePower[g] || 0) + 1;
        });
    });
    const topGenres = Object.entries(genrePower).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return (
        <div className="min-h-screen p-6 md:p-12 space-y-12 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in stagger-1">
                <div className="space-y-3">
                    <h1 className="text-5xl font-black text-white tracking-tighter glow-text">System Intel</h1>
                    <p className="text-text-muted text-lg font-medium">Real-time repository analytics and health monitoring.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-5 py-2.5 bg-primary/5 border border-primary/20 rounded-2xl text-[10px] font-black tracking-[0.2em] text-primary glow-text flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)] animate-pulse" />
                        REPOSITORY_ONLINE
                    </div>
                </div>
            </header>

            {/* HIGH DENSITY STATS */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 animate-fade-in stagger-2">
                <StatCard label="Global Archive" value={globalTotal || 0} sub="Unmatched Fidelity" accent="primary" />
                <StatCard label="Personal Library" value={total} sub="Designated Units" accent="success" />
                <StatCard label="Temporal Progress" value={`${daysWatched}d`} sub="Total Runtime" accent="warning" />
                <StatCard label="Active Sessions" value={statusCounts['TO_WATCH'] || 0} sub="Sync Pending" accent="primary" />
                <StatCard label="Finalized Data" value={statusCounts['COMPLETED'] || 0} sub="Archive Complete" accent="success" />
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-fade-in stagger-3">
                {/* ACTIVITY LOG */}
                <section className="xl:col-span-2 space-y-6">
                    <div className="glass-card rounded-[2rem] p-10 relative overflow-hidden h-full shadow-2xl border-white/5">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
                                <span className="h-5 w-5 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                                    <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary-glow)]" />
                                </span>
                                Transmission Feed
                            </h3>
                            <span className="text-[10px] font-black text-text-muted opacity-30 uppercase tracking-[0.4em]">Secure_Stream</span>
                        </div>

                        <div className="space-y-6">
                            {logs?.map((log, idx) => (
                                <div key={log.id} className={`group relative pl-10 pb-8 border-l border-white/5 last:pb-0 animate-fade-in stagger-${(idx % 5) + 1}`}>
                                    <div className="absolute left-[-5px] top-2 h-2.5 w-2.5 rounded-full bg-border border-2 border-background group-hover:bg-primary group-hover:border-primary/50 transition-all duration-300" />
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="text-sm font-black text-text-main group-hover:text-primary transition-colors">{log.description}</div>
                                            <div className="text-[10px] font-black text-text-muted/50 uppercase tracking-widest">{log.event_type}</div>
                                        </div>
                                        <div className="text-[10px] font-black text-text-muted opacity-40 whitespace-nowrap bg-white/5 px-2 py-1 rounded">
                                            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!logs?.length && (
                                <div className="text-center py-20 text-text-muted/30 font-black uppercase tracking-[0.2em]">No_Data_Incoming</div>
                            )}
                        </div>
                    </div>
                </section>

                {/* DISTRIBUTION */}
                <section className="space-y-8">
                    <div className="glass-card rounded-[2rem] p-10 space-y-10 shadow-2xl border-white/5">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Sector Weights</h3>
                        <div className="space-y-8">
                            {topGenres.map(([name, count]) => {
                                const percentage = Math.round((count / (statusCounts['COMPLETED'] || 1)) * 100);
                                return (
                                    <div key={name} className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.15em]">
                                            <span className="text-white">{name}</span>
                                            <span className="text-primary glow-text">{count} UNITS</span>
                                        </div>
                                        <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all duration-1000 shadow-[0_0_10px_var(--primary-glow)]" style={{ width: `${percentage}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <UploadIcon />
                        </div>
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Uplink Advisory</h4>
                        <p className="text-sm text-primary/80 leading-relaxed font-bold tracking-tight">
                            Maintain regular synchronization via the Mission Control interface to ensure peak neural accuracy and repository integrity.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatCard({ label, value, sub, accent }: { label: string, value: string | number, sub: string, accent: string }) {
    const accents: Record<string, string> = {
        primary: 'text-primary glow-text',
        success: 'text-success shadow-glow',
        warning: 'text-warning/80',
    };

    return (
        <div className="glass-card rounded-3xl p-8 group hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 shadow-2xl">
            <div className="text-[10px] font-black text-text-muted/50 uppercase tracking-[0.2em] mb-5">{label}</div>
            <div className={`text-4xl font-black mb-2 tracking-tighter ${accents[accent]}`}>{value}</div>
            <div className="text-[11px] font-black text-text-muted/30 uppercase tracking-widest">{sub}</div>
        </div>
    )
}

function UploadIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>;
}
