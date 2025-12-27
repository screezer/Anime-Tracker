'use client';

import { UserAnimeStatus } from '@/types';
import { updateAnimeStatus } from '@/app/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StatusSelectorProps {
    animeId: number;
    currentStatus?: UserAnimeStatus;
}

const statuses: { value: UserAnimeStatus; label: string }[] = [
    { value: 'TO_WATCH', label: 'To Watch' },
    { value: 'PLANNING', label: 'Planning' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'DROPPED', label: 'Dropped' },
];

export default function StatusSelector({ animeId, currentStatus }: StatusSelectorProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setLoading(true);
        const newStatus = e.target.value as UserAnimeStatus;
        await updateAnimeStatus(animeId, newStatus);
        setLoading(false);
        router.refresh();
    }

    return (
        <div className="flex items-center gap-2">
            <select
                disabled={loading}
                value={currentStatus || 'UNKNOWN'}
                onChange={handleChange}
                className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            >
                <option value="UNKNOWN" disabled>Set Status</option>
                {statuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                ))}
            </select>
        </div>
    );
}
