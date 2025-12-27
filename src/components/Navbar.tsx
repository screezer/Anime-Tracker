'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path ? 'text-white bg-surface' : 'text-text-muted hover:text-white hover:bg-surface-hover';

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md h-[var(--header-height)]">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg group-hover:bg-primary-hover transition-colors">
                            AT
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            AnimeTarget
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        <NavLink href="/library" label="Library" icon={<LayoutGridIcon />} activeClass={isActive('/library')} />
                        <NavLink href="/search" label="Search" icon={<SearchIcon />} activeClass={isActive('/search')} />
                        <NavLink href="/dashboard" label="Dashboard" icon={<BarChartIcon />} activeClass={isActive('/dashboard')} />
                        <NavLink href="/import" label="Import" icon={<UploadIcon />} activeClass={isActive('/import')} />
                        <NavLink href="/logs" label="Logs" icon={<FileTextIcon />} activeClass={isActive('/logs')} />
                        <NavLink href="/settings" label="Settings" icon={<SettingsIcon />} activeClass={isActive('/settings')} />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-mono text-text-muted">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        System Online
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, label, icon, activeClass }: { href: string, label: string, icon: React.ReactNode, activeClass: string }) {
    return (
        <Link href={href} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeClass}`}>
            {icon}
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
