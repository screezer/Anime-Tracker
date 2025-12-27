'use client';

import { useState } from 'react';

interface ProgressTrackerProps {
    current?: number;
    total?: number | null;
}

export default function ProgressTracker({ current = 0, total }: ProgressTrackerProps) {
    const [episodes, setEpisodes] = useState(current);

    // Fake update for now as we didn't add the `episodes_watched` column yet to DB schema
    // We'll just update local state to show UI

    const increment = () => {
        if (total && episodes >= total) return;
        setEpisodes(prev => prev + 1);
    };

    const decrement = () => {
        if (episodes <= 0) return;
        setEpisodes(prev => prev - 1);
    };

    const progress = total ? Math.min((episodes / total) * 100, 100) : 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Progress</span>
                <span className="text-white font-medium">
                    {episodes} <span className="text-zinc-600">/ {total || '?'}</span>
                </span>
            </div>

            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex gap-2 pt-1">
                <button onClick={decrement} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded py-1 px-2 text-xs transition-colors">-</button>
                <button onClick={increment} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded py-1 px-2 text-xs transition-colors">+</button>
            </div>
        </div>
    );
}
