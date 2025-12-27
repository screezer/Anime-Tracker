'use client';

import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 text-text-main">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold">Settings</h1>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-text-main">Appearance</h2>
                    <div className="p-6 rounded-xl bg-surface border border-border space-y-4">
                        <p className="text-sm text-text-muted">Choose your preferred theme.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setTheme('light')}
                                className={`px-4 py-2 rounded-lg transition-colors border font-medium ${theme === 'light' ? 'bg-primary text-white border-primary' : 'bg-surface hover:bg-surface-hover border-border text-text-muted'}`}
                            >
                                Light
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`px-4 py-2 rounded-lg transition-colors border font-medium ${theme === 'dark' ? 'bg-primary text-white border-primary' : 'bg-surface hover:bg-surface-hover border-border text-text-muted'}`}
                            >
                                Dark
                            </button>
                            <button
                                onClick={() => setTheme('system')}
                                className={`px-4 py-2 rounded-lg transition-colors border font-medium ${theme === 'system' ? 'bg-primary text-white border-primary' : 'bg-surface hover:bg-surface-hover border-border text-text-muted'}`}
                            >
                                System
                            </button>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-text-main">Data</h2>
                    <div className="p-6 rounded-xl bg-surface border border-border space-y-4">
                        <p className="text-sm text-text-muted">Manage your data.</p>
                        <button className="px-4 py-2 rounded-lg border border-error/50 text-error hover:bg-error/10 transition-colors">
                            Clear Cache
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
