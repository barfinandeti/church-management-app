'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calendar, Radio, Bell, Settings, User, Heart } from 'lucide-react';

interface BottomNavSession {
    user: {
        name: string | null;
        email: string;
        role: string;
        church?: {
            name: string;
        } | null;
    };
}

interface BottomNavProps {
    session: BottomNavSession;
}

const mainNavItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Service', href: '/reader', icon: BookOpen },
    { name: 'Events', href: '/schedule', icon: Calendar },
    { name: 'Live', href: '/live', icon: Radio },
    { name: 'Updates', href: '/notifications', icon: Bell },
    { name: 'Prayer', href: '/prayer-request', icon: Heart },
];

export default function BottomNav({ session }: BottomNavProps) {
    const pathname = usePathname();
    const isAdmin = session.user.role === 'SUPERADMIN' || session.user.role === 'CHURCH_ADMIN';

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50">
            <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
                {mainNavItems.filter(item => {
                    // Hide Prayer Request for Admins
                    if (item.href === '/prayer-request' && isAdmin) {
                        return false;
                    }
                    return true;
                }).map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-0
                                ${isActive
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-600 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-800'
                                }
                            `}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                            <span className="text-xs font-medium truncate max-w-full">{item.name}</span>
                        </Link>
                    );
                })}

                {/* Admin/Profile Icon */}
                {isAdmin ? (
                    <Link
                        href="/admin"
                        className={`
                            flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200
                            ${pathname.startsWith('/admin') || pathname.startsWith('/superadmin')
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-600 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-800'
                            }
                        `}
                    >
                        <Settings className={`w-5 h-5 ${pathname.startsWith('/admin') || pathname.startsWith('/superadmin') ? 'scale-110' : ''}`} />
                        <span className="text-xs font-medium">Admin</span>
                    </Link>
                ) : (
                    <Link
                        href="/dashboard/profile"
                        className={`
                            flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200
                            ${pathname === '/dashboard/profile'
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-600 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-800'
                            }
                        `}
                    >
                        <User className={`w-5 h-5 ${pathname === '/dashboard/profile' ? 'scale-110' : ''}`} />
                        <span className="text-xs font-medium">Profile</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}
