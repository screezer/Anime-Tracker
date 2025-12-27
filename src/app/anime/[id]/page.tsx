import { supabase } from '@/lib/supabaseClient';
import { Anime } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import StatusSelector from '@/components/StatusSelector';
import ProgressTracker from '@/components/ProgressTracker';
import RelatedAnime from '@/components/RelatedAnime';

export async function generateStaticParams() {
    const { data: animes } = await supabase.from('animes').select('id');
    return animes?.map((anime) => ({
        id: anime.id.toString(),
    })) || [];
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AnimeDetail({ params }: PageProps) {
    const { id } = await params;
    const animeId = parseInt(id);

    // Fetch Anime
    const { data: anime } = await supabase
        .from('animes')
        .select('*')
        .eq('id', animeId)
        .single();

    if (!anime) notFound();

    // Fetch User Status
    const { data: userEntry } = await supabase
        .from('user_anime_lists')
        .select('status')
        .eq('anime_id', animeId)
        .single();

    const userStatus = userEntry?.status;

    return (
        <div className="min-h-screen">
            {/* Banner */}
            <div className="h-[200px] md:h-[300px] w-full relative bg-surface overflow-hidden">
                {anime.banner_image && (
                    <Image src={anime.banner_image} alt="Banner" fill className="object-cover opacity-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-32 md:-mt-40 relative z-10 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
                    {/* LEFT COLUMN: Cover & Actions */}
                    <div className="space-y-6">
                        <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-2xl border-4 border-surface">
                            {anime.cover_image ? (
                                <Image src={anime.cover_image} alt={anime.title_romaji} fill className="object-cover" />
                            ) : (
                                <div className="bg-surface w-full h-full flex items-center justify-center text-text-muted">No Image</div>
                            )}
                        </div>

                        <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
                            <div>
                                <label className="text-xs font-mono uppercase text-text-muted mb-2 block">Status</label>
                                <StatusSelector animeId={anime.id} currentStatus={userStatus} />
                            </div>
                            <div>
                                <ProgressTracker current={0} total={anime.episodes} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Info */}
                    <div className="pt-2 md:pt-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{anime.title_english || anime.title_romaji}</h1>
                        {anime.title_native && <h2 className="text-xl text-text-muted mb-6 font-serif">{anime.title_native}</h2>}

                        <div className="flex flex-wrap gap-2 mb-8">
                            {anime.genres?.map((g: string) => (
                                <span key={g} className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-text-main hover:bg-surface-hover hover:border-primary/50 transition-colors cursor-pointer">
                                    {g}
                                </span>
                            ))}
                        </div>

                        <div className="bg-surface/30 border border-border rounded-xl p-6 md:p-8 mb-8 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Synopsis</h3>
                            <div
                                className="text-text-muted leading-relaxed space-y-4"
                                dangerouslySetInnerHTML={{ __html: anime.description || 'No description.' }}
                            />
                        </div>

                        {/* Connections */}
                        <div className="mb-12">
                            <RelatedAnime relations={anime.relations} />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <DetailItem label="Format" value={anime.format || 'TV'} />
                            <DetailItem label="Episodes" value={anime.episodes} />
                            <DetailItem label="Duration" value={anime.duration ? `${anime.duration} mins` : '?'} />
                            <DetailItem label="Score" value={anime.average_score ? `${anime.average_score}%` : 'N/A'} />
                            <DetailItem label="Season" value={`${anime.season || ''} ${anime.season_year || ''}`} />
                            <DetailItem label="Source" value={anime.source} />
                            <DetailItem label="Studios" value={anime.studios?.join(', ')} />
                            <DetailItem label="Start Date" value={anime.start_date} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string, value: any }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-text-muted uppercase font-mono">{label}</span>
            <span className="text-sm font-medium text-text-main">{value}</span>
        </div>
    )
}
