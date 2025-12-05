import { prisma } from '@/lib/prisma';
import AdminLiveClient from './AdminLiveClient';

export const dynamic = 'force-dynamic';

export default async function AdminLivePage() {
    const config = await prisma.liveStreamConfig.findFirst();
    const history = await prisma.liveStreamHistory.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
    });

    return <AdminLiveClient config={config} history={history} />;
}
