'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateLiveStreamConfig } from '@/app/actions/admin';
import { format } from 'date-fns';

import ChurchSelector from '@/components/ChurchSelector';

interface LiveStreamConfig {
    id: string;
    youtubeVideoId: string;
    isLive: boolean;
    title: string | null;
    updatedAt: Date;
}

interface LiveStreamHistory {
    id: string;
    youtubeVideoId: string;
    isLive: boolean;
    title: string | null;
    createdAt: Date;
}

interface AdminLivePageProps {
    config: LiveStreamConfig | null;
    history: LiveStreamHistory[];
    churches?: { id: string; name: string }[];
}

export default function AdminLiveClient({ config, history, churches }: AdminLivePageProps) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await updateLiveStreamConfig(formData);

            if (result?.success) {
                toast.success('Live stream configuration saved successfully!');
            } else {
                toast.error(result?.error || 'Failed to save configuration');
            }
        });
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-playfair">Live Stream Configuration</h2>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div className="flex items-center">
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

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        {isPending ? 'Saving...' : 'Save Configuration'}
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
                                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                            <td className="py-3 px-4 text-slate-200">{item.title || '-'}</td>
                                            <td className="py-3 px-4 text-slate-300 font-mono text-xs">{item.youtubeVideoId}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isLive
                                                    ? 'bg-green-900/50 text-green-200'
                                                    : 'bg-slate-700 text-slate-300'
                                                    }`}>
                                                    {item.isLive ? 'Live' : 'Offline'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-400 text-xs">
                                                {format(new Date(item.createdAt), 'MMM d, yyyy HH:mm')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
