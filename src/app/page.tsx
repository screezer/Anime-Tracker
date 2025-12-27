import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />

            <main className="max-w-4xl space-y-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-primary shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        V2.0 ALPHA IS LIVE
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
                        Precision Tracking for your <span className="text-primary italic">Anime Obsession</span>.
                    </h1>

                    <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                        The professional-grade anime management system. High-density data,
                        instant search, and deep sync capabilities. Designed for productivity,
                        built for the elite watcher.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/library"
                        className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover hover:-translate-y-1 transition-all active:scale-95"
                    >
                        Enter Control Center
                    </Link>
                    <Link
                        href="/import"
                        className="w-full sm:w-auto px-8 py-4 bg-surface border border-border text-white font-bold rounded-xl hover:bg-surface-hover hover:border-text-muted transition-all"
                    >
                        Sync Collection
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-border/50">
                    <FeatureCard
                        title="Instant Sync"
                        desc="Detect changes in your export.json and apply them with one click."
                    />
                    <FeatureCard
                        title="Dense UI"
                        desc="Admin-style high-density layouts to see more data with less scrolling."
                    />
                    <FeatureCard
                        title="Live Search"
                        desc="Zero-latency client-side filtering and sorting for huge collections."
                    />
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-surface/30 border border-border hover:border-primary/50 transition-colors text-left space-y-2">
            <h3 className="font-bold text-white">{title}</h3>
            <p className="text-sm text-text-muted leading-snug">{desc}</p>
        </div>
    );
}
