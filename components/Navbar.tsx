'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
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
                                    <>
                                        {/* Desktop: Sign In Button */}
                                        <Link
                                            href="/login"
                                            className="hidden md:inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-200"
                                        >
                                            Sign In
                                        </Link>

                                        {/* Mobile: Hamburger Menu */}
                                        <button
                                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                            aria-label="Toggle menu"
                                        >
                                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {!session && isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden fixed inset-0 z-40"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        ></div>

                        {/* Menu Content */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="absolute top-0 right-0 h-full w-64 bg-white shadow-xl"
                        >
                            <div className="p-6 space-y-6">
                                {/* Header with Close Button */}
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold font-playfair text-slate-900">
                                        Menu
                                    </span>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Navigation Links */}
                                <nav className="space-y-2">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Auth Buttons */}
                                <div className="pt-6 border-t border-slate-200 space-y-3">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="w-full px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium text-left">
                                            Login
                                        </button>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="w-full px-4 py-3 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm">
                                            Sign Up
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}