import Image from 'next/image';
import Link from 'next/link';
import { Anime, UserAnimeStatus } from '@/types';

interface AnimeCardProps {
    anime: Anime;
    status?: UserAnimeStatus;
    showStatus?: boolean;
}

const statusColors: Record<UserAnimeStatus, string> = {
    TO_WATCH: 'text-[#3db4f2] bg-[#3db4f2]/10 border-[#3db4f2]/20',
    PLANNING: 'text-[#3db4f2] bg-[#3db4f2]/10 border-[#3db4f2]/20',
    DROPPED: 'text-[#e85d75] bg-[#e85d75]/10 border-[#e85d75]/20',
    ON_HOLD: 'text-[#f19f3d] bg-[#f19f3d]/10 border-[#f19f3d]/20',
    COMPLETED: 'text-[#3db4f2] bg-[#3db4f2]/10 border-[#3db4f2]/20',
    UNKNOWN: 'text-text-muted bg-surface/50 border-border',
};

export default function AnimeCard({ anime, status, showStatus = true }: AnimeCardProps) {
    const title = anime.title_english || anime.title_romaji;

    return (
        <Link
            href={`/anime/${anime.id}`}
            className="group block space-y-3 animate-fade-in"
        >
            {/* Image Container */}
            <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-surface shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                {anime.cover_image ? (
                    <Image
                        src={anime.cover_image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 20vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted font-mono text-xs">
                        NO_IMAGE
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/90">
                            {anime.format || 'TV'}
                        </span>
                        {anime.average_score && (
                            <span className="text-[10px] font-bold text-[#3db4f2]">
                                {anime.average_score}%
                            </span>
                        )}
                        {(anime as any).is_adult && (
                            <span className="text-[9px] font-black text-white bg-error px-1 rounded">18+</span>
                        )}
                    </div>
                </div>

                {/* Top Badge (Always visible if showStatus) */}
                {showStatus && status && status !== 'UNKNOWN' && (
                    <div className="absolute top-2 right-2">
                        <div className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg backdrop-blur-md uppercase tracking-wider border ${statusColors[status]}`}>
                            {status.replace('_', ' ')}
                        </div>
                    </div>
                )}
            </div>

            {/* Title Section */}
            <div className="space-y-1 px-1">
                <h3 className="text-sm font-bold text-text-main line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {title}
                </h3>
            </div>
        </Link>
    )
}
