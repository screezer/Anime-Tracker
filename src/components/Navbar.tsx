'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-2xl h-[var(--header-height)] shadow-2xl">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl group-hover:glow-primary transition-all duration-300 transform group-hover:scale-110">
                            AT
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">
                            AnimeTarget
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 bg-surface/50 p-1 rounded-xl border border-white/5">
                        <NavLink href="/library" label="Library" icon={<LayoutGridIcon />} active={isActive('/library')} />
                        <NavLink href="/search" label="Search" icon={<SearchIcon />} active={isActive('/search')} />
                        <NavLink href="/dashboard" label="Dashboard" icon={<BarChartIcon />} active={isActive('/dashboard')} />
                        <NavLink href="/import" label="Import" icon={<UploadIcon />} active={isActive('/import')} />
                        <NavLink href="/logs" label="Logs" icon={<FileTextIcon />} active={isActive('/logs')} />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-[10px] font-black tracking-[0.2em] text-primary glow-text uppercase animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
                        Millennium Uplink
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, label, icon, active }: { href: string, label: string, icon: React.ReactNode, active: boolean }) {
    return (
        <Link
            href={href}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300
                ${active ? 'text-white bg-primary shadow-lg glow-primary' : 'text-text-muted hover:text-white hover:bg-white/5'}
            `}
        >
            <span className={active ? 'scale-110' : 'opacity-70'}>{icon}</span>
            {label}
        </Link>
    )
}

// Icons (Simple SVGs)
function LayoutGridIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
    )
}

function BarChartIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>
    )
}

function SearchIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    )
}

function SettingsIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
    )
}

function UploadIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
    )
}

function FileTextIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
    )
}
