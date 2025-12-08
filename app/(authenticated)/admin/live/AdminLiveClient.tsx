'use client';

import { useState, useTransition, useRef } from 'react';
import { toast } from 'sonner';
import { updateLiveStreamConfig, deleteLiveStreamAndHistory } from '@/app/actions/admin';
import { format } from 'date-fns';
import { Trash2, AlertTriangle, Calendar as CalendarIcon, Radio } from 'lucide-react';
import NotificationScheduler from '@/components/NotificationScheduler';

import ChurchSelector from '@/components/ChurchSelector';

interface LiveStreamConfig {
    id: string;
    youtubeVideoId: string;
    isLive: boolean;
    title: string | null;
    scheduledFor: Date | null;
    updatedAt: Date;
}

interface LiveStreamHistory {
    id: string;
    youtubeVideoId: string;
    isLive: boolean;
    title: string | null;
    scheduledFor: Date | null;
    createdAt: Date;
}

interface AdminLivePageProps {
    config: LiveStreamConfig | null;
    history: LiveStreamHistory[];
    churches?: { id: string; name: string }[];
}

export default function AdminLiveClient({ config, history, churches }: AdminLivePageProps) {
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Scheduling state
    const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
    const [scheduledTime, setScheduledTime] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Handle scheduling
        if (scheduleType === 'later') {
            if (!scheduledDate || !scheduledTime) {
                toast.error('Please select a date and time for the schedule');
                return;
            }

            const [hours, minutes] = scheduledTime.split(':');
            const scheduledDateTime = new Date(scheduledDate);
            scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

            formData.set('scheduledFor', scheduledDateTime.toISOString());
            formData.set('isLive', 'false'); // Scheduled streams aren't live yet
        } else {
            formData.delete('scheduledFor');
        }

        startTransition(async () => {
            const result = await updateLiveStreamConfig(formData);

            if (result?.success) {
                toast.success('Live stream configuration saved successfully!');
                if (scheduleType === 'later') {
                    // Reset schedule form
                    setScheduleType('now');
                    setScheduledDate(undefined);
                    setScheduledTime('');
                }
            } else {
                toast.error(result?.error || 'Failed to save configuration');
            }
        });
    };

    const handleDelete = async () => {
        if (!deletingId) return;

        startTransition(async () => {
            const result = await deleteLiveStreamAndHistory(deletingId);
            if (result?.success) {
                toast.success('Live stream history deleted successfully');
                setDeletingId(null);
            } else {
                toast.error(result?.error || 'Failed to delete history');
            }
        });
    };

    const getStatus = (item: LiveStreamHistory) => {
        if (item.isLive) {
            return { label: 'Live', className: 'bg-red-600 text-white animate-pulse' };
        }

        const scheduledFor = item.scheduledFor ? new Date(item.scheduledFor) : null;
        const now = new Date();

        if (scheduledFor && scheduledFor > now) {
            return { label: 'Scheduled', className: 'bg-indigo-900/50 text-indigo-200' };
        }

        return { label: 'Streamed', className: 'bg-slate-700 text-slate-300' };
    };

    return (
        <div className="space-y-8">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 max-w-2xl">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {churches && churches.length > 0 && (
                        <ChurchSelector churches={churches} />
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">YouTube Video ID</label>
                        <input
                            type="text"
                            name="youtubeVideoId"
                            defaultValue={config?.youtubeVideoId || ''}
                            placeholder="e.g. dQw4w9WgXcQ"
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Enter the ID from the YouTube URL (e.g. youtube.com/watch?v=<b>dQw4w9WgXcQ</b>)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Stream Title</label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={config?.title || ''}
                            placeholder="e.g. Sunday Morning Worship"
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Schedule Toggle */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-4">
                        <div className="flex gap-4">
                            <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-colors ${scheduleType === 'now'
                                    ? 'bg-indigo-600/20 border-indigo-500/50'
                                    : 'border-slate-700 hover:bg-slate-800'
                                }`}>
                                <input
                                    type="radio"
                                    name="scheduleType"
                                    value="now"
                                    checked={scheduleType === 'now'}
                                    onChange={() => setScheduleType('now')}
                                    className="sr-only"
                                />
                                <Radio className={`w-5 h-5 ${scheduleType === 'now' ? 'text-indigo-400' : 'text-slate-400'}`} />
                                <div>
                                    <div className={`font-medium ${scheduleType === 'now' ? 'text-indigo-200' : 'text-slate-200'}`}>Start / Update Now</div>
                                    <div className="text-xs text-slate-400">Control live status immediately</div>
                                </div>
                            </label>

                            <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-colors ${scheduleType === 'later'
                                    ? 'bg-indigo-600/20 border-indigo-500/50'
                                    : 'border-slate-700 hover:bg-slate-800'
                                }`}>
                                <input
                                    type="radio"
                                    name="scheduleType"
                                    value="later"
                                    checked={scheduleType === 'later'}
                                    onChange={() => setScheduleType('later')}
                                    className="sr-only"
                                />
                                <CalendarIcon className={`w-5 h-5 ${scheduleType === 'later' ? 'text-indigo-400' : 'text-slate-400'}`} />
                                <div>
                                    <div className={`font-medium ${scheduleType === 'later' ? 'text-indigo-200' : 'text-slate-200'}`}>Schedule for Later</div>
                                    <div className="text-xs text-slate-400">Set a future date and time</div>
                                </div>
                            </label>
                        </div>

                        {scheduleType === 'now' ? (
                            <div className="flex items-center pt-2 animate-in fade-in slide-in-from-top-2">
                                <input
                                    type="checkbox"
                                    name="isLive"
                                    id="isLive"
                                    defaultChecked={config?.isLive || false}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-700 rounded bg-slate-800"
                                />
                                <label htmlFor="isLive" className="ml-2 block text-sm text-slate-200">
                                    Is Live Now?
                                </label>
                            </div>
                        ) : (
                            <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                                <NotificationScheduler
                                    title="Schedule Live Stream"
                                    date={scheduledDate}
                                    setDate={setScheduledDate}
                                    time={scheduledTime}
                                    setTime={setScheduledTime}
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending || (scheduleType === 'later' && (!scheduledDate || !scheduledTime))}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        {isPending ? 'Saving...' : (scheduleType === 'later' ? 'Schedule Stream' : 'Save Configuration')}
                    </button>
                </form>
            </div>

            {/* History Section */}
            {history.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white font-playfair">Live Stream History</h3>
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Title</th>
                                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Video ID</th>
                                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Date/Time</th>
                                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item) => {
                                        const status = getStatus(item);
                                        return (
                                            <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                                <td className="py-3 px-4 text-slate-200">{item.title || '-'}</td>
                                                <td className="py-3 px-4 text-slate-300 font-mono text-xs">{item.youtubeVideoId}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-slate-400 text-xs">
                                                    {item.scheduledFor
                                                        ? format(new Date(item.scheduledFor), 'MMM d, yyyy HH:mm')
                                                        : format(new Date(item.createdAt), 'MMM d, yyyy HH:mm')
                                                    }
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <button
                                                        onClick={() => setDeletingId(item.id)}
                                                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                                        title="Delete History"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-red-500/10 rounded-full shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white">End & Delete Stream?</h3>
                                <p className="text-slate-400 mt-2 text-sm">
                                    Are you sure you want to delete this live stream history record?
                                    <br /><br />
                                    <span className="text-red-400 font-medium">Warning:</span> If this stream is currently live, it will be ended immediately. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? 'Deleting...' : 'Yes, End & Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
