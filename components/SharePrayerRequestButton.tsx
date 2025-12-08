'use client';

import Link from 'next/link';
import { Share2 } from 'lucide-react';

interface SharePrayerRequestButtonProps {
    request: {
        name: string;
        request: string;
    };
}

export default function SharePrayerRequestButton({ request }: SharePrayerRequestButtonProps) {
    const title = `Prayer Request for ${request.name}`;
    const message = `<p><strong>Prayer Request from ${request.name}:</strong></p><p>${request.request}</p>`;

    // Encode params
    const params = new URLSearchParams({
        title,
        message
    });

    return (
        <Link
            href={`/admin/notifications?${params.toString()}`}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
            title="Share as Notification"
        >
            <Share2 className="w-4 h-4" />
        </Link>
    );
}
