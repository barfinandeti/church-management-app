'use client';

import { useState, useTransition, useRef } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const JoditEditor = dynamic(() => import('@/components/JoditEditor'), {
    ssr: false,
});

import ChurchSelector from './ChurchSelector';

interface NotificationFormProps {
    onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string } | void>;
    initialData?: {
        title: string;
        type: string;
        message: string;
    };
    submitLabel?: string;
    churches?: { id: string; name: string }[];
}

export default function NotificationForm({ onSubmit, initialData, submitLabel = 'Post Notification', churches }: NotificationFormProps) {
    const [content, setContent] = useState<string>(initialData?.message || '');
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Add editor data
        formData.set('message', content);

        startTransition(async () => {
            const result = await onSubmit(formData);

            if (result?.success === false) {
                toast.error(result.error || 'Failed to save notification');
            } else {
                toast.success('Notification saved successfully!');

                // Clear form ONLY when adding a new notification
                if (!initialData && formRef.current) {
                    formRef.current.reset();
                    setContent('');
                }
            }
        });
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {churches && churches.length > 0 && (
                <ChurchSelector churches={churches} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        defaultValue={initialData?.title}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                    <select
                        name="type"
                        defaultValue={initialData?.type || 'info'}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="info">Info</option>
                        <option value="event">Event</option>
                        <option value="reminder">Reminder</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                <div className="bg-slate-800 text-slate-400 border border-slate-700 rounded-md overflow-hidden">
                    <JoditEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Write your notification message..."
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
                {isPending ? 'Saving...' : submitLabel}
            </button>
        </form>
    );
}
