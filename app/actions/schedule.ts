'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addDays, startOfWeek, endOfWeek, format } from 'date-fns';

export async function createWeeklySchedule(formData: FormData) {
    const weekStartStr = formData.get('weekStart') as string;
    if (!weekStartStr) return;

    const weekStart = new Date(weekStartStr);
    // Ensure it's Monday
    const start = startOfWeek(weekStart, { weekStartsOn: 1 });
    const end = endOfWeek(weekStart, { weekStartsOn: 1 });

    // Check if exists
    const existing = await prisma.weeklySchedule.findFirst({
        where: {
            weekStart: start,
        },
    });

    if (existing) {
        // Already exists, just redirect to it
        redirect(`/admin/schedule?weekId=${existing.id}`);
    }

    // Create schedule
    const schedule = await prisma.weeklySchedule.create({
        data: {
            weekStart: start,
            weekEnd: end,
            label: `Week of ${format(start, 'MMM d')}`,
        },
    });

    // Create 7 days
    for (let i = 0; i < 7; i++) {
        const dayDate = addDays(start, i);
        await prisma.dayPlan.create({
            data: {
                weekId: schedule.id,
                date: dayDate,
                title: format(dayDate, 'EEEE'), // Default title is day name
            },
        });
    }

    revalidatePath('/schedule');
    revalidatePath('/admin/schedule');
    redirect(`/admin/schedule?weekId=${schedule.id}`);
}

export async function updateDayPlan(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const bibleVerses = formData.get('bibleVerses') as string;
    const hymns = formData.get('hymns') as string;
    const activities = formData.get('activities') as string;
    const weekId = formData.get('weekId') as string;

    await prisma.dayPlan.update({
        where: { id },
        data: {
            title,
            bibleVerses,
            hymns,
            activities,
        },
    });

    revalidatePath('/schedule');
    revalidatePath(`/admin/schedule`);
}

export async function deleteWeeklySchedule(formData: FormData) {
    const id = formData.get('id') as string;
    await prisma.weeklySchedule.delete({ where: { id } });
    revalidatePath('/schedule');
    revalidatePath('/admin/schedule');
    redirect('/admin/schedule');
}
