import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
    const { data: logs } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    return (
        <div className="min-h-screen p-6 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">System Logs</h1>
                <p className="text-text-muted mt-1">Audit trail of imports and sync actions.</p>
            </header>

            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-surface-hover/50 text-text-muted font-mono uppercase text-xs">
                        <tr>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">Event</th>
                            <th className="p-4">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs?.map((log) => (
                            <tr key={log.id} className="hover:bg-surface-hover/30 transition-colors">
                                <td className="p-4 font-mono text-xs text-text-muted whitespace-nowrap">
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <Badge type={log.event_type} />
                                </td>
                                <td className="p-4 text-text-main">
                                    {log.description}
                                </td>
                            </tr>
                        ))}
                        {(!logs || logs.length === 0) && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-text-muted">No logs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Badge({ type }: { type: string }) {
    let color = 'bg-zinc-700 text-zinc-300';
    if (type === 'IMPORT_SCAN') color = 'bg-blue-500/20 text-blue-400 border-blue-500/30 border';
    if (type === 'APPLY_CHANGE') color = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 border';
    if (type === 'ERROR') color = 'bg-red-500/20 text-red-400 border-red-500/30 border';

    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${color}`}>
            {type}
        </span>
    )
}
