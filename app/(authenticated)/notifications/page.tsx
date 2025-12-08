import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { Card } from "@/components/ui/card";
import { Bell } from 'lucide-react';

async function getNotifications(churchId: string) {
    return await prisma.notification.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { churchId },
                        { churchId: null }
                    ]
                },
                {
                    OR: [
                        { isPublished: true },
                        { scheduledFor: { lte: new Date() } }
                    ]
                }
            ]
        },
        orderBy: [
            { scheduledFor: 'desc' },
            { createdAt: 'desc' }
        ],
    });
}

export default async function NotificationsPage() {
    const session = await getSession();

    if (!session) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Please log in to view notifications</p>
            </div>
        );
    }

    if (!session.user.churchId) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Notifications</h1>
                <p className="text-slate-500">You are not associated with a church yet. Please contact an administrator.</p>
            </div>
        );
    }

    const notifications = await getNotifications(session.user.churchId);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">Notifications</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">All updates and announcements</p>
            </div>

            <div className="grid gap-4">
                {notifications.length > 0 ? (
                    notifications.map((note) => (
                        <Card key={note.id} className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow relative overflow-hidden">
                            {note.churchId === null && (
                                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-medium uppercase tracking-wider">
                                    Public
                                </div>
                            )}
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${note.churchId === null
                                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                        }`}>
                                        <Bell className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium text-slate-900 dark:text-white pr-12">{note.title}</h3>
                                        <time className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full whitespace-nowrap">
                                            {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                                        </time>
                                    </div>
                                    <div
                                        className="mt-2 text-sm text-slate-600 dark:text-slate-400 prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: note.message }}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500">No notifications found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
