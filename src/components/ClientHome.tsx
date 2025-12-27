'use client';

import { useState, useMemo } from 'react';
import AnimeCard from '@/components/AnimeCard';
import AnimeListRow from '@/components/AnimeListRow';
import FilterBar from '@/components/FilterBar';
import { Anime, UserAnimeStatus } from '@/types';

interface ExtendedAnime extends Anime {
    userStatus?: UserAnimeStatus;
}

export default function ClientHome({ initialData }: { initialData: ExtendedAnime[] }) {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('pop_desc');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [genre, setGenre] = useState('');
    const [activeStatus, setActiveStatus] = useState<UserAnimeStatus | 'ALL'>('ALL');

    const statusTabs: { id: UserAnimeStatus | 'ALL', label: string }[] = [
        { id: 'ALL', label: 'All Library' },
        { id: 'TO_WATCH', label: 'Watching' },
        { id: 'PLANNING', label: 'Planning' },
        { id: 'COMPLETED', label: 'Completed' },
        { id: 'ON_HOLD', label: 'On Hold' },
        { id: 'DROPPED', label: 'Dropped' },
    ];

    // 1. Get all unique genres for filter
    const allGenres = useMemo(() => {
        const set = new Set<string>();
        initialData.forEach(a => a.genres?.forEach(g => set.add(g)));
        return Array.from(set).sort();
    }, [initialData]);

    // 2. Recommendation Engine Logic
    const suggestions = useMemo(() => {
        // Find favorite genres from COMPLETED/WATCHING
        const favoriteGenres: Record<string, number> = {};
        initialData.filter(a => a.userStatus === 'COMPLETED' || a.userStatus === 'TO_WATCH').forEach(a => {
            a.genres?.forEach(g => {
                favoriteGenres[g] = (favoriteGenres[g] || 0) + 1;
            });
        });

        // Filter out anime already in list (except TO_WATCH/PLANNING maybe? No, let's suggest new things or Planning)
        const unStarted = initialData.filter(a => !a.userStatus || a.userStatus === 'PLANNING' || a.userStatus === 'UNKNOWN');

        // Score them
        const scored = unStarted.map(a => {
            let score = 0;
            a.genres?.forEach(g => {
                score += favoriteGenres[g] || 0;
            });
            // Boost by popularity/score slightly
            score += (a.average_score || 0) / 10;
            return { ...a, recScore: score };
        });

        return scored.sort((a, b) => b.recScore - a.recScore).slice(0, 10);
    }, [initialData]);

    // 3. Filtering & Sorting for main library
    const filtered = useMemo(() => {
        let result = initialData;

        if (activeStatus !== 'ALL') {
            result = result.filter(a => a.userStatus === activeStatus);
        }

        if (search) {
            const lower = search.toLowerCase();
            result = result.filter(a =>
            (a.title_english?.toLowerCase().includes(lower) ||
                a.title_romaji?.toLowerCase().includes(lower))
            );
        }

        if (genre) {
            result = result.filter(a => a.genres?.includes(genre));
        }

        result.sort((a, b) => {
            if (sort === 'pop_desc') return (b.popularity || 0) - (a.popularity || 0);
            if (sort === 'score_desc') return (b.average_score || 0) - (a.average_score || 0);
            if (sort === 'title_asc') return (a.title_english || a.title_romaji || '').localeCompare(b.title_english || b.title_romaji || '');
            if (sort === 'year_desc') return (b.start_date || '').localeCompare(a.start_date || '');
            if (sort === 'eps_desc') return (b.episodes || 0) - (a.episodes || 0);
            return 0;
        });

        return result;
    }, [initialData, search, sort, genre, activeStatus]);

    return (
        <div className="space-y-12">
            {/* Suggestions High-Intensity Tray (Only show if not searching/filtering) */}
            {!search && !genre && activeStatus === 'ALL' && suggestions.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                        <h2 className="text-xl font-black text-white uppercase tracking-wider">Neural Suggestions</h2>
                        <span className="text-[10px] font-mono text-text-muted border border-border px-1.5 py-0.5 rounded uppercase">Based on history</span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-none snap-x mask-fade-right">
                        {suggestions.map(anime => (
                            <div key={anime.id} className="w-[180px] shrink-0 snap-start transform transition-transform hover:scale-[1.02]">
                                <AnimeCard
                                    anime={anime}
                                    status={anime.userStatus}
                                    showStatus={false}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Main Library Control */}
            <section className="space-y-8">
                {/* Status Tabs UI */}
                <div className="flex items-center gap-1 border-b border-border p-1 overflow-x-auto scrollbar-none">
                    {statusTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveStatus(tab.id)}
                            className={`px-6 py-3 rounded-t-xl text-sm font-bold tracking-tight transition-all relative whitespace-nowrap ${activeStatus === tab.id
                                ? 'text-primary'
                                : 'text-text-muted hover:text-text-main hover:bg-surface/30'
                                }`}
                        >
                            {tab.label}
                            {activeStatus === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                            )}
                        </button>
                    ))}
                </div>

                <FilterBar
                    search={search} setSearch={setSearch}
                    sort={sort} setSort={setSort}
                    view={view} setView={setView}
                    genre={genre} setGenre={setGenre}
                    genres={allGenres}
                    total={filtered.length}
                />

                {view === 'grid' ? (
                    <div className="dense-grid">
                        {filtered.map(anime => (
                            <AnimeCard
                                key={anime.id}
                                anime={anime}
                                status={anime.userStatus}
                                showStatus={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-surface rounded-xl overflow-hidden shadow-sm border border-border/50">
                        {/* List Header */}
                        <div className="flex items-center gap-4 py-3 px-4 bg-background/50 border-b border-border text-[10px] font-black text-text-muted uppercase tracking-widest">
                            <div className="w-8 text-center shrink-0">#</div>
                            <div className="w-12 shrink-0" />
                            <div className="flex-1">Title</div>
                            <div className="w-16 text-center shrink-0">Score</div>
                            <div className="w-20 text-center shrink-0 hidden sm:block">Format</div>
                            <div className="w-20 text-center shrink-0 hidden md:block">Episodes</div>
                            <div className="w-24 text-right shrink-0">Status</div>
                        </div>
                        {filtered.map((anime, idx) => (
                            <AnimeListRow
                                key={anime.id}
                                anime={anime}
                                status={anime.userStatus}
                                index={idx}
                            />
                        ))}
                    </div>
                )}

                {filtered.length === 0 && (
                    <div className="py-40 text-center border-2 border-dashed border-border rounded-3xl group">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-surface border border-border mb-4 text-text-muted group-hover:rotate-12 transition-transform">
                            <SearchIcon className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Zero Results Found</h3>
                        <p className="text-text-muted">Refine your scanning parameters or update the repository.</p>
                        <button onClick={() => { setSearch(''); setGenre(''); }} className="mt-4 text-primary font-bold hover:underline">Clear all filters</button>
                    </div>
                )}
            </section>
        </div>
    );
}

function SearchIcon({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>; }
