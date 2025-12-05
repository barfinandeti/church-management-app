import { prisma } from '@/lib/prisma';
import { updateLiveStreamConfig } from '@/app/actions/admin';

export const dynamic = 'force-dynamic';

export default async function AdminLivePage() {
    const config = await prisma.liveStreamConfig.findFirst();

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-playfair">Live Stream Configuration</h2>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 max-w-2xl">
                <form action={updateLiveStreamConfig} className="space-y-6">
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
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Save Configuration
                    </button>
                </form>
            </div>
        </div>
    );
}
