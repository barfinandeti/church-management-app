import { prisma } from '@/lib/prisma';
import ScheduleView from './ScheduleView';
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';

export const dynamic = 'force-dynamic';

async function getScheduleForWeek(date: Date) {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(date, { weekStartsOn: 1 });

    // We look for a schedule that overlaps with this week or has matching start date
    // Ideally, we store weekStart in DB.
    // Let's find by weekStart range.

    // Since we might not have exact time match, we look for weekStart between start and end of the target week day 1.
    // Actually, let's just match the date part or use a range.

    const schedule = await prisma.weeklySchedule.findFirst({
        where: {
            weekStart: {
                gte: start,
                lte: end,
            },
        },
        include: {
            days: true,
        },
    });

    return schedule;
}

export default async function SchedulePage() {
    const today = new Date();

    const thisWeek = await getScheduleForWeek(today);
    const nextWeek = await getScheduleForWeek(addWeeks(today, 1));
    const lastWeek = await getScheduleForWeek(subWeeks(today, 1));

    return (
        <div className="space-y-6">
            <header className="text-center">
                <h1 className="text-3xl font-bold font-playfair text-slate-900">
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
