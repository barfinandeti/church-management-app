import { prisma } from '@/lib/prisma';
import { createNotification, deleteNotification } from '@/app/actions/admin';
import DeleteButton from '@/components/DeleteButton';
import NotificationForm from '@/components/NotificationForm';
import { requireAdmin, getChurchFilter } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage() {
    const session = await requireAdmin();
    const churchFilter = getChurchFilter(session);

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
            <h2 className="text-2xl font-bold text-white font-playfair">Notifications</h2>

            {/* Add New Notification */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Add New Notification</h3>
                <NotificationForm onSubmit={createNotification} churches={churches} />
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
                                            <td className="px-6 py-4 text-sm text-slate-400">{notification.church.name}</td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <form action={deleteNotification.bind(null, notification.id)}>
                                                <DeleteButton />
                                            </form>
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
