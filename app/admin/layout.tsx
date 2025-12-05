'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { logout } from '@/app/actions/auth';

const navItems = [
    { name: 'Worship Content', href: '/admin/content' },
    { name: 'Schedule', href: '/admin/schedule' },
    { name: 'Notifications', href: '/admin/notifications' },
    { name: 'Live Stream', href: '/admin/live' },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex flex-col md:flex-row rounded-lg bg-slate-950">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 rounded-lg shrink-0">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-white font-playfair">Admin Panel</h1>
                    <p className="text-xs text-slate-500 mt-1">Order of Worship</p>
                </div>
                <nav className="px-4 pb-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    'block px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                    <form action={logout} className="pt-4 mt-4 border-t border-slate-800">
                        <button
                            type="submit"
                            className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                        >
                            Sign Out
                        </button>
                    </form>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
