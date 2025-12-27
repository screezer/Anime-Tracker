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
        <main className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto space-y-12">
            <header className="space-y-2">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Mission Control</h1>
                <p className="text-text-muted text-lg">Initialize a global uplink to synchronize your archives.</p>
            </header>

            <section className="relative group">
                {/* Drag & Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className={`
                        relative h-96 rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-6 overflow-hidden
                        ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border bg-surface hover:border-primary/50'}
                        ${status !== 'IDLE' && 'pointer-events-none'}
                    `}
                >
                    {/* Background Grid Effect */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3db4f2_1px,transparent_1px)] [background-size:20px_20px]" />

                    {status === 'IDLE' && (
                        <>
                            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-bounce">
                                <UploadIcon />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-xl font-bold text-white">Drop `export.json` here</p>
                                <p className="text-text-muted text-sm px-10">Our neural engine will scan and link your entries to the AniList universe.</p>
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
                        <div className="flex flex-col items-center gap-8 text-center">
                            <div className="relative h-24 w-24">
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <div className="absolute inset-4 border-4 border-primary/30 border-b-transparent rounded-full animate-spin-slow" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest animate-pulse">
                                    {status === 'READING' ? 'Decrypting...' : 'Establishing Uplink...'}
                                </h3>
                                <p className="text-text-muted font-mono text-xs">Scanning ID-blocks and Name-indices</p>
                            </div>
                        </div>
                    )}

                    {status === 'DONE' && (
                        <div className="flex flex-col items-center gap-6 text-center animate-fade-in">
                            <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center text-success border border-success/30 shadow-[0_0_20px_rgba(22,163,74,0.3)]">
                                <CheckIcon />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-white">Synchronization Complete</h3>
                                <p className="text-text-muted">Linked {stats?.count} units to your neural engine.</p>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <Link href="/library" className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors">
                                    View Library
                                </Link>
                                <button onClick={() => setStatus('IDLE')} className="px-6 py-2 bg-surface border border-border text-white rounded-xl font-bold hover:bg-surface-hover transition-colors">
                                    Sync Another
                                </button>
                            </div>
                        </div>
                    )}

                    {status === 'ERROR' && (
                        <div className="flex flex-col items-center gap-6 text-center animate-fade-in">
                            <div className="h-20 w-20 rounded-full bg-error/20 flex items-center justify-center text-error border border-error/30">
                                <XIcon />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white">Uplink Interrupted</h3>
                                <p className="text-error/80 font-medium">{error}</p>
                            </div>
                            <button onClick={() => setStatus('IDLE')} className="mt-4 px-6 py-2 bg-surface border border-border text-white rounded-xl font-bold hover:bg-surface-hover transition-colors">
                                Retry Connection
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Transmission Logs Preview */}
            <section className="bg-surface border border-border rounded-3xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Transmission Status</h3>
                    <Link href="/logs" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">View Detailed Logs</Link>
                </div>
                <div className="space-y-3 font-mono text-[11px]">
                    <LogLine label="ENCRYPTION" value="AES-256" />
                    <LogLine label="PROTOCOL" value="JSON_UPLOAD_V2" />
                    <LogLine label="STATUS" value={status === 'DONE' ? 'READY' : status === 'IDLE' ? 'WAITING' : 'BUSY'} color={status === 'DONE' ? 'text-success' : 'text-warning'} />
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
