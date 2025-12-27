import Image from 'next/image';
import Link from 'next/link';
import { Anime, UserAnimeStatus } from '@/types';

interface AnimeListRowProps {
    anime: Anime;
    status?: UserAnimeStatus;
    index: number;
}

const statusColors: Record<UserAnimeStatus, string> = {
    TO_WATCH: 'text-[#3db4f2]',
    PLANNING: 'text-[#3db4f2]',
    DROPPED: 'text-[#e85d75]',
    ON_HOLD: 'text-[#f19f3d]',
    COMPLETED: 'text-[#3db4f2]',
    UNKNOWN: 'text-text-muted',
};

export default function AnimeListRow({ anime, status, index }: AnimeListRowProps) {
    const title = anime.title_english || anime.title_romaji;

    return (
        <Link
            href={`/anime/${anime.id}`}
            className="group flex items-center gap-4 py-2 px-4 bg-surface hover:bg-surface-hover/50 transition-colors border-b border-border/50 last:border-0"
        >
            <div className="w-8 text-xs font-bold text-text-muted text-center shrink-0">
                {index + 1}
            </div>

            {/* Image Micro */}
            <div className="relative h-12 w-10 shrink-0 rounded overflow-hidden bg-background">
                {anime.cover_image && (
                    <Image src={anime.cover_image} alt={title} fill className="object-cover" />
                )}
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold truncate text-text-main group-hover:text-primary transition-colors">
                    {title}
                </h3>
            </div>

            {/* Score */}
            <div className="w-16 text-center shrink-0">
                <span className={`text-sm font-bold ${anime.average_score && anime.average_score >= 80 ? 'text-primary' : 'text-text-muted'}`}>
                    {anime.average_score ? `${anime.average_score}%` : '--'}
                </span>
            </div>

            {/* Type */}
            <div className="w-20 text-xs font-bold text-text-muted text-center shrink-0 hidden sm:block">
                {anime.format || 'TV'}
            </div>

            {/* Episodes */}
            <div className="w-20 text-xs font-bold text-text-muted text-center shrink-0 hidden md:block">
                {anime.episodes || '?'} EPS
            </div>

            {/* Status Indicator */}
            <div className="w-24 text-right shrink-0">
                {status && status !== 'UNKNOWN' && (
                    <span className={`text-[10px] font-black uppercase tracking-widest ${statusColors[status]}`}>
                        {status.replace('_', ' ')}
                    </span>
                )}
            </div>
        </Link>
    )
}
