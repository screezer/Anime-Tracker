'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Anime, UserAnimeStatus } from '@/types';
import AnimeCard from '@/components/AnimeCard';

const PAGE_SIZE = 40;

export default function GlobalSearch({ initialUserIds }: { initialUserIds: Set<number> }) {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('pop_desc');
    const [genre, setGenre] = useState('');
    const [format, setFormat] = useState('');
    const [year, setYear] = useState('');
    const [includeAdult, setIncludeAdult] = useState(false);

    const [results, setResults] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [userStatuses, setUserStatuses] = useState<Record<number, UserAnimeStatus>>({});

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Status tracking is now native to the anime object (ustatus)
    // We can remove the extra fetch effect.

    // DB Query Logic
    const fetchResults = useCallback(async (isNewSearch: boolean, currentPage: number) => {
        setLoading(true);
        try {
            let query = supabase.from('animes').select('*');

            if (search) {
                query = query.or(`title_english.ilike.%${search}%,title_romaji.ilike.%${search}%`);
            }

            if (genre) {
                query = query.contains('genres', [genre]);
            }

            if (format) {
                query = query.eq('format', format);
            }

            if (year) {
                query = query.eq('season_year', parseInt(year));
            }

            if (!includeAdult) {
                query = query.eq('is_adult', false);
            }

            // Sorting
            if (sort === 'pop_desc') query = query.order('popularity', { ascending: false });
            else if (sort === 'score_desc') query = query.order('average_score', { ascending: false });
            else if (sort === 'title_asc') query = query.order('title_english', { ascending: true });
            else if (sort === 'year_desc') query = query.order('start_date', { ascending: false });

            // Pagination
            const from = currentPage * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;
            query = query.range(from, to);

            const { data, error } = await query;
            if (error) throw error;

            if (isNewSearch) {
                setResults(data || []);
            } else {
                setResults(prev => [...prev, ...(data || [])]);
            }
            setHasMore((data?.length || 0) === PAGE_SIZE);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [search, sort, genre, format, year, includeAdult]);

    // Reset and Initial Load
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        const timer = setTimeout(() => {
            fetchResults(true, 0);
        }, 500);
        return () => clearTimeout(timer);
    }, [search, sort, genre, format, year, includeAdult, fetchResults]);

    // Load more when page changes
    useEffect(() => {
        if (page > 0) {
            fetchResults(false, page);
        }
    }, [page, fetchResults]);

    return (
        <div className="space-y-8">
            <section className="bg-surface border border-border rounded-xl p-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest pl-1">Global Database Scan</label>
                        <input
                            type="text"
                            placeholder="Enter anime title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                    <div className="w-full md:w-48 space-y-2">
                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest pl-1">Sort Mode</label>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white appearance-none"
                        >
                            <option value="pop_desc">Popularity</option>
                            <option value="score_desc">Rating</option>
                            <option value="title_asc">Alphabetical</option>
                            <option value="year_desc">Latest</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FilterSelect label="Genre" value={genre} onChange={setGenre} options={['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller']} />
                    <FilterSelect label="Format" value={format} onChange={setFormat} options={['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL', 'MUSIC']} />
                    <FilterSelect label="Year" value={year} onChange={setYear} options={Array.from({ length: 50 }, (_, i) => (2027 - i).toString())} />
                    <div className="flex items-end pb-3">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={includeAdult}
                                onChange={(e) => setIncludeAdult(e.target.checked)}
                                className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary/20"
                            />
                            <span className="text-xs font-bold text-text-muted group-hover:text-text-main transition-colors">Include Adult</span>
                        </label>
                    </div>
                </div>
            </section>

            <div className="dense-grid">
                {results.map((anime, idx) => {
                    const card = (
                        <AnimeCard
                            anime={anime}
                            status={anime.ustatus as UserAnimeStatus}
                            showStatus={true}
                        />
                    );

                    if (results.length === idx + 1) {
                        return (
                            <div ref={lastElementRef} key={anime.id}>
                                {card}
                            </div>
                        );
                    } else {
                        return (
                            <div key={anime.id}>
                                {card}
                            </div>
                        );
                    }
                })}
            </div>

            {loading && (
                <div className="py-10 flex justify-center">
                    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {!loading && results.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl">
                    <p className="text-text-muted">No results found in global repository.</p>
                </div>
            )}
        </div>
    );
}

function FilterSelect({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: string[] }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-text-muted tracking-widest pl-1">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-xs font-bold text-text-main appearance-none hover:border-primary/50 transition-colors"
            >
                <option value="">All</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    )
}
