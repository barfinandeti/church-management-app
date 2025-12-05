import { prisma } from '@/lib/prisma';
import ReaderView from './ReaderView';

export const dynamic = 'force-dynamic'; // Ensure we get latest data

export default async function ReaderPage() {
    const sections = await prisma.bookSection.findMany({
        orderBy: { order: 'asc' },
    });

    return (
        <div className="h-full">
            <h1 className="text-3xl font-bold font-playfair text-slate-800 mb-4 hidden md:block">
                Reader
            </h1>
            <ReaderView sections={sections} />
        </div>
    );
}
