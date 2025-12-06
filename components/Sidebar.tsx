'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calendar, Radio, Bell, User, Settings, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';

interface SidebarSession {
    user: {
        name: string | null;
        email: string;
        role: string;
        church?: {
            name: string;
        } | null;
    };
}

interface SidebarProps {
    session: SidebarSession;
}

const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Order of Service', href: '/reader', icon: BookOpen },
    { name: 'Events', href: '/schedule', icon: Calendar },
    { name: 'Live Stream', href: '/live', icon: Radio },
    { name: 'Updates', href: '/notifications', icon: Bell },
];

const adminItems = [
    { name: 'Worship Content', href: '/admin/content', icon: BookOpen },
    { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Live Stream', href: '/admin/live', icon: Radio },
];

export default function Sidebar({ session }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0">
            {/* Church Name Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-playfair">
                    {session.user.church?.name || 'My Church'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Church Portal
                </p>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}

                {/* Admin Panel */}
                {(session.user.role === 'SUPERADMIN' || session.user.role === 'CHURCH_ADMIN') && (
                    <>
                        <div className="px-4 mt-6 mb-2">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Admin Panel
                            </h3>
                        </div>
                        {adminItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                        ${isActive
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                        {session.user.role === 'SUPERADMIN' && (
                            <Link
                                href="/admin/users"
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                    ${pathname.startsWith('/admin/users')
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                    }
                                `}
                            >
                                <User className="w-5 h-5" />
                                <span className="text-sm">User Management</span>
                            </Link>
                        )}
                        {session.user.role === 'SUPERADMIN' && (
                            <Link
                                href="/superadmin"
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                    ${pathname === '/superadmin'
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                    }
                                `}
                            >
                                <Settings className="w-5 h-5" />
                                <span className="text-sm">Super Admin</span>
                            </Link>
                        )}
                    </>
                )}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Link
                    href="/dashboard/profile"
                    className="flex-1 flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors min-w-0"
                >
                    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium shrink-0">
                        {session.user.name?.[0] || session.user.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {session.user.name || session.user.email.split('@')[0]}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            View Profile
                        </p>
                    </div>
                </Link>

                <form action={logout}>
                    <button
                        type="submit"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </aside>
    );
}
