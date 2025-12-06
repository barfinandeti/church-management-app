'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addDays, startOfWeek, endOfWeek, format } from 'date-fns';
import { requireAdmin } from '@/lib/auth';

export async function createWeeklySchedule(formData: FormData) {
    const session = await requireAdmin();

    let churchId = session.user.churchId;
    if (session.user.role === 'SUPERADMIN') {
        const formChurchId = formData.get('churchId') as string;
        if (formChurchId) {
            churchId = formChurchId;
        } else {
            return { success: false, error: 'Please select a church' };
        }
    }

    if (!churchId) {
        return { success: false, error: 'No church context found' };
    }

    const weekStartStr = formData.get('weekStart') as string;
    if (!weekStartStr) return;

    const weekStart = new Date(weekStartStr);
    // Ensure it's Monday
    const start = startOfWeek(weekStart, { weekStartsOn: 1 });
    const end = endOfWeek(weekStart, { weekStartsOn: 1 });

    // Check if exists for this church
    const existing = await prisma.weeklySchedule.findFirst({
        where: {
            weekStart: start,
            churchId
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
            churchId
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
    const session = await requireAdmin();

    const id = formData.get('id') as string;

    // Verify ownership via week -> church
    const dayPlan = await prisma.dayPlan.findUnique({
        where: { id },
        include: { week: true }
    });

    if (!dayPlan) return;

    if (session.user.role !== 'SUPERADMIN' && dayPlan.week.churchId !== session.user.churchId) {
        throw new Error('Unauthorized');
    }

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
    const session = await requireAdmin();

    const id = formData.get('id') as string;

    // Verify ownership
    const schedule = await prisma.weeklySchedule.findUnique({ where: { id } });
    if (!schedule) return;

    if (session.user.role !== 'SUPERADMIN' && schedule.churchId !== session.user.churchId) {
        throw new Error('Unauthorized');
    }

    await prisma.weeklySchedule.delete({ where: { id } });
    revalidatePath('/schedule');
    revalidatePath('/admin/schedule');
    redirect('/admin/schedule');
}
