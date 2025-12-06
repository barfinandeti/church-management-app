import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import Link from 'next/link';
import { Users, Building2, BookOpen, Bell, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SuperAdminDashboard() {
    const session = await requireSuperAdmin();

    // Fetch global stats
    const churchCount = await prisma.church.count();
    const userCount = await prisma.user.count();
    const contentCount = await prisma.bookSection.count();
    const notificationCount = await prisma.notification.count();

    // Fetch recent churches
    const recentChurches = await prisma.church.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { users: true }
            }
        }
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white font-playfair">Super Admin Dashboard</h1>
                        <p className="text-slate-400 mt-1">Global System Overview</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">
                            Logged in as <span className="text-indigo-400 font-medium">{session.user.email}</span>
                        </span>
                        <form action="/api/auth/logout" method="POST">
                            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-sm font-medium transition-colors">
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-lg">
                                <Building2 className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Total Churches</p>
                                <p className="text-2xl font-bold text-white">{churchCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-lg">
                                <Users className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Total Users</p>
                                <p className="text-2xl font-bold text-white">{userCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/10 rounded-lg">
                                <BookOpen className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Content Sections</p>
                                <p className="text-2xl font-bold text-white">{contentCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-500/10 rounded-lg">
                                <Bell className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Active Notifications</p>
                                <p className="text-2xl font-bold text-white">{notificationCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/admin/users" className="group bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-colors">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">User Management</h3>
                        <p className="text-sm text-slate-400">Manage admins, users, and roles across all churches.</p>
                    </Link>
                    <Link href="/admin/content" className="group bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-colors">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">Global Content</h3>
                        <p className="text-sm text-slate-400">View and manage worship content for all churches.</p>
                    </Link>
                    <Link href="/admin/live" className="group bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-colors">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">Live Streams</h3>
                        <p className="text-sm text-slate-400">Monitor live stream configurations.</p>
                    </Link>
                </div>

                {/* Recent Churches */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Recent Churches</h3>
                        <Link href="/superadmin/churches/new">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Add New Church
                            </button>
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-800">
                            <thead className="bg-slate-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Church Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Users</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {recentChurches.map((church) => (
                                    <tr key={church.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">
                                            <Link href={`/superadmin/churches/${church.id}`} className="hover:text-indigo-400 transition-colors">
                                                {church.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{church.slug}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{church._count.users}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                            {new Date(church.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
