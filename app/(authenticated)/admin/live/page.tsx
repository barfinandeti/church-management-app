import { prisma } from '@/lib/prisma';
import AdminLiveClient from './AdminLiveClient';
import { requireAdmin, getChurchFilter } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLivePage() {
    const session = await requireAdmin();
    const churchFilter = getChurchFilter(session);

    // Get current config
    const currentConfig = await prisma.liveStreamConfig.findFirst({
        where: churchFilter
    });

    // Get history
    const history = await prisma.liveStreamHistory.findMany({
        where: churchFilter,
        orderBy: { createdAt: 'desc' },
        take: 10,
    });

    let churches: { id: string; name: string }[] = [];
    if (session.user.role === 'SUPERADMIN') {
        churches = await prisma.church.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-playfair">Live Stream Management</h2>

            {session.user.role === 'SUPERADMIN' && !session.user.churchId && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-lg mb-6">
                    <p>Note: As a Superadmin without a specific church context, you are viewing/editing the default (first) church's configuration.</p>
                </div>
            )}

            <AdminLiveClient
                config={currentConfig}
                history={history}
                churches={churches}
            />
        </div>
    );
}
