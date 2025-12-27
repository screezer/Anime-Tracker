'use client';

import { useState, useCallback } from 'react';
import { smartSyncAction } from '@/app/actions/smartSync';
import Link from 'next/link';

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'READING' | 'SYNCING' | 'DONE' | 'ERROR'>('IDLE');
    const [stats, setStats] = useState<{ count: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFile = useCallback(async (selectedFile: File) => {
        if (!selectedFile.name.endsWith('.json')) {
            setError('Please upload a valid JSON file.');
            setStatus('ERROR');
            return;
        }

        setFile(selectedFile);
        setStatus('READING');
        setError(null);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = JSON.parse(e.target?.result as string);
                setStatus('SYNCING');

                const result = await smartSyncAction(content);

                if (result.success) {
                    setStats({ count: result.count || 0 });
                    setStatus('DONE');
                } else {
                    setError(result.error || 'Sync failed');
                    setStatus('ERROR');
                }
            } catch (err) {
                setError('Invalid JSON format');
                setStatus('ERROR');
            }
        };
        reader.readAsText(selectedFile);
    }, []);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFile(droppedFile);
    };

    return (
        <main className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto space-y-16 animate-fade-in">
            <header className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-glow animate-float">
                        <UploadIcon />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter glow-text">Mission Control</h1>
                </div>
                <p className="text-text-muted text-lg font-medium">Initialize a global uplink to synchronize your archives.</p>
            </header>

            <section className="relative group">
                {/* Drag & Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className={`
                        relative h-[450px] rounded-[2.5rem] border-2 border-dashed transition-all duration-700 flex flex-col items-center justify-center gap-8 overflow-hidden
                        ${isDragging ? 'border-primary bg-primary/10 scale-[1.02] glow-primary' : 'border-white/5 glass-card hover:border-primary/30'}
                        ${status !== 'IDLE' && 'pointer-events-none'}
                    `}
                >
                    {/* Background Grid Intelligence Effect */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(var(--primary)_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />

                    {status === 'IDLE' && (
                        <>
                            <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary animate-float border border-primary/20 shadow-glow">
                                <UploadIcon />
                            </div>
                            <div className="text-center space-y-3 px-10 relative z-10">
                                <p className="text-3xl font-black text-white tracking-tighter">Awaiting `export.json`</p>
                                <p className="text-text-muted font-bold max-w-md mx-auto leading-relaxed">Our neural engine will scan and link your entries to the AniList universe with surgical precision.</p>
                            </div>
                            <input
                                type="file"
                                accept=".json"
                                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </>
                    )}

                    {(status === 'READING' || status === 'SYNCING') && (
                        <div className="flex flex-col items-center gap-10 text-center relative z-10">
                            <div className="relative h-32 w-32">
                                <div className="absolute inset-0 border-[6px] border-primary border-t-transparent rounded-full animate-spin shadow-glow" />
                                <div className="absolute inset-6 border-[6px] border-primary/20 border-b-transparent rounded-full animate-spin-slow" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-4 w-4 rounded-full bg-primary animate-pulse shadow-glow" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-white uppercase tracking-[0.3em] animate-pulse glow-text">
                                    {status === 'READING' ? 'Decrypting' : 'Establishing Uplink'}
                                </h3>
                                <p className="text-text-muted font-black text-xs uppercase tracking-[0.2em] opacity-40">Scanning ID-blocks and Name-indices</p>
                            </div>
                        </div>
                    )}

                    {status === 'DONE' && (
                        <div className="flex flex-col items-center gap-10 text-center animate-fade-in relative z-10">
                            <div className="h-28 w-28 rounded-full bg-success/20 flex items-center justify-center text-success border-2 border-success/30 shadow-[0_0_40px_rgba(0,250,154,0.3)] animate-float">
                                <CheckIcon />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-4xl font-black text-white tracking-tighter">Uplink Successful</h3>
                                <p className="text-text-muted text-lg font-bold">Linked <span className="text-success glow-text">{stats?.count}</span> units to your neural engine.</p>
                            </div>
                            <div className="flex gap-6 mt-4">
                                <Link href="/library" className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:glow-primary transition-all duration-300 transform hover:scale-105">
                                    Access Library
                                </Link>
                                <button onClick={() => setStatus('IDLE')} className="px-10 py-4 glass-card text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                                    New Uplink
                                </button>
                            </div>
                        </div>
                    )}

                    {status === 'ERROR' && (
                        <div className="flex flex-col items-center gap-10 text-center animate-fade-in relative z-10">
                            <div className="h-28 w-28 rounded-full bg-error/20 flex items-center justify-center text-error border-2 border-error/30 shadow-[0_0_40px_rgba(232,93,117,0.3)]">
                                <XIcon />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-white uppercase tracking-widest">Uplink Denied</h3>
                                <p className="text-error font-bold text-lg">{error}</p>
                            </div>
                            <button onClick={() => setStatus('IDLE')} className="mt-4 px-10 py-4 bg-surface border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest hover:border-error/50 transition-all">
                                Retry Connection
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Transmission Logs Preview */}
            <section className="glass-card rounded-[2rem] p-10 space-y-8 shadow-2xl border-white/5">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Telemetry Status</h3>
                    <Link href="/logs" className="text-[10px] font-black text-primary hover:glow-text uppercase tracking-widest transition-all">Deep Logs</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <LogLine label="ENCRYPTION" value="AES-256-INDUSTRIAL" />
                    <LogLine label="PROTOCOL" value="JSON_UPLINK_V3" />
                    <LogLine label="STATUS" value={status === 'DONE' ? 'READY_IDLE' : status === 'IDLE' ? 'LISTENING' : 'TRANSMITTING'} color={status === 'DONE' ? 'text-success' : 'text-primary'} />
                </div>
            </section>
        </main>
    );
}

function LogLine({ label, value, color = 'text-text-muted' }: { label: string, value: string, color?: string }) {
    return (
        <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-text-muted opacity-50">{label}</span>
            <span className={`font-bold ${color}`}>{value}</span>
        </div>
    );
}

function UploadIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>;
}

function CheckIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}

function XIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>;
}
