'use client';

import { useState, useTransition, useRef } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

const JoditEditor = dynamic(() => import('@/components/JoditEditor'), {
    ssr: false,
});

import ChurchSelector from './ChurchSelector';
import NotificationScheduler from './NotificationScheduler';

interface NotificationFormProps {
    onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string } | void>;
    initialData?: {
        title: string;
        type: string;
        message: string;
        churchId?: string | null;
    };
    submitLabel?: string;
    churches?: { id: string; name: string }[];
    isEditing?: boolean;
}

export default function NotificationForm({ onSubmit, initialData, submitLabel = 'Post Notification', churches, isEditing = !!initialData }: NotificationFormProps) {
    const [content, setContent] = useState<string>(initialData?.message || '');
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
    const [scheduledDate, setScheduledDate] = useState<Date>();
    const [scheduledTime, setScheduledTime] = useState('12:00');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Add editor data
        formData.set('message', content);

        // Add schedule data
        if (scheduleType === 'later' && scheduledDate) {
            const [hours, minutes] = scheduledTime.split(':');
            const dateTime = new Date(scheduledDate);
            dateTime.setHours(parseInt(hours), parseInt(minutes));
            formData.set('scheduledFor', dateTime.toISOString());
        }

        startTransition(async () => {
            const result = await onSubmit(formData);

            if (result?.success === false) {
                toast.error(result.error || 'Failed to save notification');
            } else if (!initialData) {
                toast.success('Notification saved successfully!');

                if (formRef.current) {
                    formRef.current.reset();
                    setContent('');
                    setScheduleType('now');
                    setScheduledDate(undefined);
                    setScheduledTime('12:00');
                }
            }
        });
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {churches && churches.length > 0 && (
                <ChurchSelector churches={churches} defaultValue={initialData?.churchId || undefined} />
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
                        <option value="prayer-request">Prayer Request</option>
                    </select>
                </div>
            </div>

            {/* Schedule Options */}
            {!isEditing && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Schedule for Later</label>
                            <p className="text-xs text-slate-500 mt-1">
                                {scheduleType === 'now' ? 'Post immediately' : 'Schedule for a specific date & time'}
                            </p>
                        </div>
                        <Switch
                            checked={scheduleType === 'later'}
                            onCheckedChange={(checked) => setScheduleType(checked ? 'later' : 'now')}
                        />
                    </div>

                    {scheduleType === 'later' && (
                        <div className="mt-4">
                            <NotificationScheduler
                                date={scheduledDate}
                                setDate={setScheduledDate}
                                time={scheduledTime}
                                setTime={setScheduledTime}
                            />
                        </div>
                    )}
                </div>
            )}

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
                disabled={isPending || (scheduleType === 'later' && !scheduledDate)}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
                {isPending ? 'Saving...' : (scheduleType === 'later' ? 'Schedule Notification' : submitLabel)}
            </button>
        </form>
    );
}
