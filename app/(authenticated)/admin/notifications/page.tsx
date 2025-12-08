import { prisma } from '@/lib/prisma';
import { createNotification, deleteNotification } from '@/app/actions/admin';
import DeleteButton from '@/components/DeleteButton';
import NotificationForm from '@/components/NotificationForm';
import SuccessToast from '@/components/SuccessToast';
import { requireAdmin, getChurchFilter } from '@/lib/auth';
import Link from 'next/link';
import { Edit2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await requireAdmin();
    const churchFilter = getChurchFilter(session);

    // Handle pre-filled data from query params (e.g. from sharing prayer request)
    const { title: titleParam, message: messageParam } = await searchParams;
    const title = typeof titleParam === 'string' ? titleParam : '';
    const message = typeof messageParam === 'string' ? messageParam : '';

    const initialData = title || message ? {
        title,
        message,
        type: 'prayer-request', // Set default type for shared requests
        churchId: session.user.churchId || undefined
    } : undefined;

    const notifications = await prisma.notification.findMany({
        where: churchFilter,
        include: {
            church: true
        },
        orderBy: { createdAt: 'desc' },
    });

    let churches: { id: string; name: string }[] = [];
    if (session.user.role === 'SUPERADMIN') {
        churches = await prisma.church.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
    }

    return (
        <div className="space-y-8">
            <SuccessToast />
            <h2 className="text-2xl font-bold text-white font-playfair">Notifications</h2>

            {/* Add New Notification */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Add New Notification</h3>
                <NotificationForm
                    key={initialData?.title || 'new'}
                    onSubmit={createNotification}
                    churches={churches}
                    initialData={initialData}
                    isEditing={false}
                />
            </div>

            {/* List Notifications */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Message</th>
                                {session.user.role === 'SUPERADMIN' && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Church</th>
                                )}
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {notifications.length === 0 ? (
                                <tr>
                                    <td colSpan={session.user.role === 'SUPERADMIN' ? 5 : 4} className="px-6 py-8 text-center text-slate-500">
                                        No notifications yet
                                    </td>
                                </tr>
                            ) : (
                                notifications.map((notification) => (
                                    <tr key={notification.id}>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-200">{notification.title}</td>
                                        <td className="px-6 py-4 text-sm text-slate-300">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.type === 'event' ? 'bg-indigo-500/10 text-indigo-400' :
                                                notification.type === 'reminder' ? 'bg-amber-500/10 text-amber-400' :
                                                    'bg-slate-500/10 text-slate-400'
                                                }`}>
                                                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 max-w-md truncate" dangerouslySetInnerHTML={{ __html: notification.message }} />
                                        {session.user.role === 'SUPERADMIN' && (
                                            <td className="px-6 py-4 text-sm text-slate-400">{notification.church?.name || 'N/A'}</td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/notifications/${notification.id}`}
                                                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <form action={deleteNotification.bind(null, notification.id)}>
                                                    <DeleteButton />
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
