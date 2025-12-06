'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '@/app/actions/auth';

// Define a local type for the session to avoid importing server-only modules
interface NavbarSession {
    user: {
        name: string | null;
        email: string;
        role: string;
        church?: {
            name: string;
            slug: string;
        } | null;
    };
}

// Only public routes in Navbar - church-specific routes are in Sidebar
const navItems = [
    { name: 'Home', href: '/', icon: Home },
];

export default function Navbar({ session }: { session: NavbarSession | null }) {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative"
                >
                    <div className="flex items-center justify-between h-16">
                        {/* Logo/Brand */}
                        <div className="flex-shrink-0 flex items-center gap-2">
                            {session?.user?.church ? (
                                <span className="text-xl font-bold font-playfair text-slate-900">
                                    {session.user.church.name}
                                </span>
                            ) : (
                                <Link href="/" className="text-xl font-bold font-playfair text-slate-900">
                                    FaithDesk
                                </Link>
                            )}
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link key={item.name} href={item.href}>
                                        <div
                                            className={`
                                                px-3 py-2 rounded-lg transition-all duration-200
                                                flex items-center gap-2
                                                ${isActive
                                                    ? 'bg-slate-100 text-slate-900 font-medium'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }
                                            `}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : ''}`} />
                                            <span className="text-sm">{item.name}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Side: Auth / Profile */}
                        <div className="flex items-center gap-3">
                            {session ? (
                                <>
                                    <Link
                                        href={session.user.role === 'SUPERADMIN' ? '/superadmin' : '/dashboard'}
                                        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </Link>

                                    <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>

                                    <Link href="/dashboard/profile" className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-lg transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                                            {session.user.name?.[0] || session.user.email[0].toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[100px] truncate">
                                            {session.user.name || session.user.email.split('@')[0]}
                                        </span>
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
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-200"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Navigation Bar */}
                    <div className="md:hidden py-2 border-t border-slate-100 mt-2 overflow-x-auto">
                        <div className="flex items-center justify-between gap-2 px-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link key={item.name} href={item.href} className="flex-1 min-w-[60px]">
                                        <div className={`flex flex-col items-center gap-1 py-2 rounded-lg ${isActive ? 'bg-slate-50 text-indigo-600' : 'text-slate-500'}`}>
                                            <Icon className="w-5 h-5" />
                                            <span className="text-[10px] font-medium">{item.name}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                            {session && (
                                <Link href="/dashboard" className="flex-1 min-w-[60px]">
                                    <div className="flex flex-col items-center gap-1 py-2 rounded-lg text-slate-500">
                                        <LayoutDashboard className="w-5 h-5" />
                                        <span className="text-[10px] font-medium">Dash</span>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </nav>
    );
}