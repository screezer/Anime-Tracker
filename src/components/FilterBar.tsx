'use client';

interface FilterBarProps {
    search: string;
    setSearch: (s: string) => void;
    sort: string;
    setSort: (s: string) => void;
    view: 'grid' | 'list';
    setView: (v: 'grid' | 'list') => void;
    genre: string;
    setGenre: (g: string) => void;
    total: number;
    genres: string[];
}

export default function FilterBar({ search, setSearch, sort, setSort, view, setView, genre, setGenre, total, genres }: FilterBarProps) {
    return (
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-surface rounded-xl p-6 shadow-sm border border-border/50">
            {/* Search */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Search</span>
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-64 bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-main focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-text-muted/40"
                    />
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">

                {/* Genre */}
                <div className="flex flex-col gap-2 flex-1 md:flex-none">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Genre</span>
                    <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="bg-background border border-border text-text-main text-sm rounded-lg px-4 py-2.5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none cursor-pointer hover:border-text-muted transition-all min-w-[140px] appearance-none"
                    >
                        <option value="">All</option>
                        {genres.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                {/* Sort */}
                <div className="flex flex-col gap-2 flex-1 md:flex-none">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Sort</span>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-background border border-border text-text-main text-sm rounded-lg px-4 py-2.5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none cursor-pointer hover:border-text-muted transition-all min-w-[140px] appearance-none"
                    >
                        <option value="pop_desc">Popularity</option>
                        <option value="score_desc">Average Score</option>
                        <option value="title_asc">Title</option>
                        <option value="year_desc">Release Date</option>
                    </select>
                </div>

                {/* View Toggles */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">View</span>
                    <div className="flex items-center bg-background border border-border rounded-lg p-1 h-[42px]">
                        <button
                            onClick={() => setView('grid')}
                            className={`px-3 h-full rounded-md transition-all flex items-center justify-center ${view === 'grid' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-surface/50'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-3 h-full rounded-md transition-all flex items-center justify-center ${view === 'list' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-surface/50'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
