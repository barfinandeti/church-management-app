import { prisma } from '@/lib/prisma';
import { createWeeklySchedule, updateDayPlan, deleteWeeklySchedule } from '@/app/actions/schedule';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import DeleteButton from '@/components/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminSchedulePage(props: {
    searchParams: Promise<{ weekId?: string }>;
}) {
    const searchParams = await props.searchParams;
    const weeks = await prisma.weeklySchedule.findMany({
        orderBy: { weekStart: 'desc' },
    });

    const selectedWeekId = searchParams.weekId;
    const selectedWeek = selectedWeekId
        ? await prisma.weeklySchedule.findUnique({
            where: { id: selectedWeekId },
            include: { days: true },
        })
        : null;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-playfair">Schedule Management</h2>

            {/* Create New Week */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Create/Select Week</h3>
                <form action={createWeeklySchedule} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Week Start Date (Monday)</label>
                        <input
                            type="date"
                            name="weekStart"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Create / Open Week
                    </button>
                </form>

                {/* List of Weeks */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {weeks.map((week) => (
                        <a
                            key={week.id}
                            href={`/admin/schedule?weekId=${week.id}`}
                            className={clsx(
                                'px-3 py-1 rounded-full text-sm border transition-colors',
                                week.id === selectedWeekId
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                            )}
                        >
                            {format(new Date(week.weekStart), 'MMM d')} - {format(new Date(week.weekEnd), 'MMM d')}
                        </a>
                    ))}
                </div>
            </div>

            {/* Selected Week Editor */}
            {selectedWeek && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-slate-200">
                            Editing: {format(new Date(selectedWeek.weekStart), 'MMM d')} - {format(new Date(selectedWeek.weekEnd), 'MMM d, yyyy')}
                        </h3>
                        <form action={deleteWeeklySchedule}>
                            <input type="hidden" name="id" value={selectedWeek.id} />
                            <DeleteButton />
                        </form>
                    </div>

                    <div className="grid gap-6">
                        {selectedWeek.days
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map((day) => (
                                <div key={day.id} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                    <div className="mb-4">
                                        <h4 className="text-lg font-medium text-indigo-400">
                                            {format(new Date(day.date), 'EEEE, MMM d')}
                                        </h4>
                                    </div>
                                    <form action={updateDayPlan} className="space-y-4">
                                        <input type="hidden" name="id" value={day.id} />
                                        <input type="hidden" name="weekId" value={selectedWeek.id} />

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                defaultValue={day.title}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1">Bible Verses</label>
                                                <textarea
                                                    name="bibleVerses"
                                                    rows={2}
                                                    defaultValue={day.bibleVerses || ''}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1">Hymns</label>
                                                <textarea
                                                    name="hymns"
                                                    rows={2}
                                                    defaultValue={day.hymns || ''}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Activities</label>
                                            <textarea
                                                name="activities"
                                                rows={3}
                                                defaultValue={day.activities || ''}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                            ></textarea>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                Save Day
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
