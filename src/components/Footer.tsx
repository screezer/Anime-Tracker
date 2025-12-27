export default function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background py-8 mt-auto">
            <div className="mx-auto flex flex-col md:flex-row max-w-7xl items-center justify-between px-6 gap-4">
                <div className="text-sm text-text-muted">
                    © 2025 AnimeTarget Admin. All systems normal.
                </div>

                <div className="flex items-center gap-6 text-xs font-mono text-text-muted">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" />
                        Database: Connected
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" />
                        API: Online
                    </div>
                    <div>
                        Version 2.0.0
                    </div>
                </div>
            </div>
        </footer>
    );
}
