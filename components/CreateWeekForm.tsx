'use client';

import { createWeeklySchedule } from '@/app/actions/schedule';
import ChurchSelector from '@/components/ChurchSelector';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface CreateWeekFormProps {
    churches: { id: string; name: string }[];
}

export default function CreateWeekForm({ churches }: CreateWeekFormProps) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await createWeeklySchedule(formData);
            if (result && !result.success) {
                toast.error(result.error || 'Failed to create week');
            }
            // If successful, it redirects, so no need to toast success here usually
        });
    };

    return (
        <form action={handleSubmit} className="flex flex-col gap-4">
            {churches.length > 0 && (
                <ChurchSelector churches={churches} className="w-full md:w-1/2" />
            )}
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-400 mb-1">Week Start Date (Monday)</label>
                    <input
                        type="date"
                        name="weekStart"
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {isPending ? 'Processing...' : 'Create / Open Week'}
                </button>
            </div>
        </form>
    );
}
