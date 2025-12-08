import { prisma } from '@/lib/prisma';
import ScheduleView from './ScheduleView';
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function getScheduleForWeek(date: Date, churchId?: string) {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(date, { weekStartsOn: 1 });

    // Fetch schedules that match the week AND (belong to church OR are public)
    const schedules = await prisma.weeklySchedule.findMany({
        where: {
            weekStart: {
                gte: start,
                lte: end,
            },
            OR: [
                { churchId: churchId || '' }, // If churchId is undefined, this won't match anything (which is fine if we only want public)
                { churchId: null }
            ]
        },
        include: {
            days: true,
        },
        orderBy: {
            createdAt: 'desc' // Tie-breaker
        }
    });

    // Prioritize church-specific schedule over public one
    // If churchId is present, find one with that churchId.
    // Otherwise, fallback to one with churchId === null.

    const churchSchedule = schedules.find(s => s.churchId === churchId);
    const publicSchedule = schedules.find(s => s.churchId === null);

    return churchSchedule || publicSchedule || null;
}

export default async function SchedulePage() {
    const session = await getSession();
    const churchId = session?.user?.churchId || undefined;
    const today = new Date();

    const thisWeek = await getScheduleForWeek(today, churchId);
    const nextWeek = await getScheduleForWeek(addWeeks(today, 1), churchId);
    const lastWeek = await getScheduleForWeek(subWeeks(today, 1), churchId);

    return (
        <div className="space-y-6">
            <header className="text-center">
                <h1 className="text-3xl font-bold font-playfair text-slate-800 dark:text-white/90 mb-4 hidden md:block">
                    Weekly Schedule
                </h1>
            </header>
            <ScheduleView
                thisWeek={thisWeek}
                nextWeek={nextWeek}
                lastWeek={lastWeek}
            />
        </div>
    );
}
