'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updatePrayerRequestStatus, deletePrayerRequest } from '@/app/actions/prayer';

interface StatusSelectProps {
    requestId: string;
    currentStatus: string;
}

export default function PrayerRequestStatusSelect({ requestId, currentStatus }: StatusSelectProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        const result = await updatePrayerRequestStatus(requestId, newStatus);

        if (result?.success === false) {
            toast.error(result.error || 'Failed to update status');
        } else {
            setStatus(newStatus);
            toast.success('Status updated successfully');
        }
        setIsUpdating(false);
    };

    return (
        <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-sm text-slate-200 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
        >
            <option value="pending">Pending</option>
            <option value="praying">Praying</option>
            <option value="answered">Answered</option>
        </select>
    );
}
