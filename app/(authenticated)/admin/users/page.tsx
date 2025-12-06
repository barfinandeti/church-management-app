import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import UserForm from '@/components/UserForm';
import { deleteUser } from '@/app/actions/users';
import DeleteButton from '@/components/DeleteButton';
import Link from 'next/link';
import { Edit2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const session = await requireAdmin();

    // Fetch users based on role
    const users = await prisma.user.findMany({
        where: session.user.role === 'SUPERADMIN'
            ? {}
            : { churchId: session.user.churchId },
        include: {
            church: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    // Fetch churches for dropdown (only needed for SUPERADMIN)
    const churches = session.user.role === 'SUPERADMIN'
        ? await prisma.church.findMany({ orderBy: { name: 'asc' } })
        : [];

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-playfair">User Management</h2>

            {/* Create User Form */}
            <UserForm
                currentUserRole={session.user.role}
                currentUserChurchId={session.user.churchId}
                churches={churches}
            />

            {/* Users List */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Church</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">
                                        {user.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'SUPERADMIN' ? 'bg-purple-500/10 text-purple-400' :
                                            user.role === 'CHURCH_ADMIN' ? 'bg-indigo-500/10 text-indigo-400' :
                                                'bg-slate-500/10 text-slate-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                        {user.church?.name || (user.role === 'SUPERADMIN' ? 'All Churches' : 'N/A')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            {user.id !== session.user.id && (
                                                <form action={deleteUser.bind(null, user.id)}>
                                                    <DeleteButton />
                                                </form>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
