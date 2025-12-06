import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getLiveStreamConfig() {
    return await prisma.liveStreamConfig.findFirst({
        orderBy: { updatedAt: 'desc' },
    });
}

export default async function LivePage() {
    const liveConfig = await getLiveStreamConfig();
    const isLive = liveConfig?.isLive ?? false;

    return (
        <div className="space-y-8">
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold font-playfair text-slate-800">
                    Live Stream
                </h1>
            </header>

            <section className="bg-slate-200 rounded-3xl overflow-hidden shadow-2xl">
                {isLive && liveConfig?.youtubeVideoId ? (
                    <div className="aspect-video w-full">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${liveConfig.youtubeVideoId}?autoplay=1`}
                            title="Live Worship"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                ) : (
                    <div className="aspect-video w-full flex items-center justify-center bg-slate-300">
                        <div className="text-center p-6">
                            <p className="text-lg mb-2 text-slate-700">No live stream currently.</p>
                            {liveConfig?.youtubeVideoId && (
                                <p className="text-sm text-slate-600">Check back soon for our next service!</p>
                            )}
                        </div>
                    </div>
                )}
                <div className="p-6 bg-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {isLive ? '🔴 Live Now' : 'Stream Offline'}
                    </h2>
                    {liveConfig?.title && (
                        <p className="text-slate-700 mt-1">{liveConfig.title}</p>
                    )}
                </div>
            </section>
        </div>
    );
}
