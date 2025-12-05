import { prisma } from '@/lib/prisma';
import { createNotification, deleteNotification } from '@/app/actions/admin';
import DeleteButton from '@/components/DeleteButton';
import NotificationForm from '@/components/NotificationForm';
import { format } from 'date-fns';
import Link from 'next/link';
import { Edit2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage() {
    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-playfair">Notifications</h2>

            {/* Add New Notification */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Add New Notification</h3>
                <NotificationForm onSubmit={createNotification} />
            </div>

            {/* List Notifications */}
            <div className="space-y-4">
                {notifications.map((note) => (
                    <div key={note.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium uppercase tracking-wide text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                                    {note.type}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                                </span>
                            </div>
                            <h4 className="text-lg font-medium text-slate-200">{note.title}</h4>
                            <div
                                className="text-slate-400 text-sm mt-1 prose prose-sm prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: note.message }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={`/admin/notifications/${note.id}`}
                                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </Link>
                            <form action={deleteNotification.bind(null, note.id)}>
                                <DeleteButton />
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
