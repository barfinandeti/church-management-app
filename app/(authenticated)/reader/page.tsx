import { prisma } from '@/lib/prisma';
import ReaderView from './ReaderView';
import { getSession } from '@/lib/auth';
import { getContentFilter } from '@/lib/content-helpers';

export const dynamic = 'force-dynamic'; // Ensure we get latest data

export default async function ReaderPage() {
    const session = await getSession();

    // Filter: Public content OR User's Church content
    const where = session?.user.churchId
        ? {
            OR: [
                { churchId: null },
                { churchId: session.user.churchId }
            ]
        }
        : { churchId: null };

    const sections = await prisma.bookSection.findMany({
        where,
        orderBy: { order: 'asc' },
    });

    return (
        <div className="h-full">
            <h1 className="text-3xl font-bold font-playfair text-slate-800 dark:text-white/90 mb-4 hidden md:block">
                Reader
            </h1>
            <ReaderView sections={sections} />
        </div>
    );
}
