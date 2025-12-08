import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { format } from 'date-fns';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Radio, Bell, ChevronRight } from 'lucide-react';
import InstallPWA from '@/components/InstallPWA';
import AppGuide from '@/components/AppGuide';

async function getTodayService(churchId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const service = await prisma.worshipService.findFirst({
        where: {
            churchId,
            date: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    return service;
}

async function getRecentNotifications(churchId: string) {
    return await prisma.notification.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { churchId },
                        { churchId: null }
                    ]
                },
                {
                    OR: [
                        { isPublished: true },
                        { scheduledFor: { lte: new Date() } }
                    ]
                }
            ]
        },
        orderBy: [
            { scheduledFor: 'desc' },
            { createdAt: 'desc' },
        ],
        take: 5,
    });
}

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) return null;

    // Handle Super Admin View
    if (session.user.role === 'SUPERADMIN') {
        return (
            <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">
                        Welcome, {session.user.name?.split(' ')[0] || 'Super Admin'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <div className="mt-6">
                        <Link href="/superadmin">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                Go to Super Admin Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/admin/users" className="group">
                        <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white dark:bg-slate-900">
                            <div className="p-6 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-transform duration-500 group-hover:scale-110">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">User Management</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage all users and admins</p>
                                </div>
                                <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/admin/content" className="group">
                        <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white dark:bg-slate-900">
                            <div className="p-6 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-transform duration-500 group-hover:scale-110">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Global Content</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage worship content</p>
                                </div>
                                <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/superadmin" className="group">
                        <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white dark:bg-slate-900">
                            <div className="p-6 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 transition-transform duration-500 group-hover:scale-110">
                                    <Radio className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">System Overview</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">View global statistics</p>
                                </div>
                                <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        );
    }

    // Regular User / Church Admin View
    if (!session.user.churchId) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">No Church Associated</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Please contact an administrator to be added to a church.</p>
            </div>
        );
    }

    const service = await getTodayService(session.user.churchId);
    const notifications = await getRecentNotifications(session.user.churchId);

    const quickActions = [
        {
            title: "Order of Service",
            description: "Today's worship guide",
            icon: BookOpen,
            href: "/reader",
            gradient: "from-amber-50/50 to-amber-100/50",
            iconColor: "text-amber-700",
            hoverShadow: "hover:shadow-amber-200/20",
        },
        {
            title: "Events",
            description: "Weekly schedule",
            icon: Calendar,
            href: "/schedule",
            gradient: "from-blue-50/50 to-blue-100/50",
            iconColor: "text-blue-700",
            hoverShadow: "hover:shadow-blue-200/20",
        },
        {
            title: "Live Stream",
            description: "Watch services",
            icon: Radio,
            href: "/live",
            gradient: "from-rose-50/50 to-rose-100/50",
            iconColor: "text-rose-700",
            hoverShadow: "hover:shadow-rose-200/20",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <InstallPWA />
                <AppGuide />
            </div>

            {/* Welcome Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                {session.user.church?.name && (
                    <h2 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                        {session.user.church.name}
                    </h2>
                )}
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">
                    Welcome, {session.user.name?.split(' ')[0] || 'Member'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </p>
                {service && (
                    <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-indigo-900 dark:text-indigo-300">Today's Service Available</h3>
                            <p className="text-sm text-indigo-700 dark:text-indigo-400">{service.title}</p>
                        </div>
                        <Link href={`/reader?id=${service.id}`}>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                View Order
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, i) => {
                    const Icon = action.icon;
                    return (
                        <Link key={i} href={action.href} className="group">
                            <Card className={`relative overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white dark:bg-slate-900`}>
                                <div className="p-6 space-y-4">
                                    <div className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${action.iconColor} transition-transform duration-500 group-hover:scale-110`}>
                                        <Icon className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {action.description}
                                        </p>
                                    </div>
                                    <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Notifications */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-playfair">Latest Updates</h2>
                    <Link href="/notifications" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        View All
                    </Link>
                </div>

                <div className="grid gap-4">
                    {notifications.length > 0 ? (
                        notifications.map((note) => (
                            <Card key={note.id} className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow relative overflow-hidden">
                                {note.churchId === null && (
                                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-medium uppercase tracking-wider">
                                        Public
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    <div className="shrink-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${note.churchId === null
                                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                            <Bell className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-slate-900 dark:text-white pr-12">{note.title}</h3>
                                            <time className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full whitespace-nowrap">
                                                {format(new Date(note.createdAt), 'MMM d')}
                                            </time>
                                        </div>
                                        <div
                                            className="mt-2 text-sm text-slate-600 dark:text-slate-400 prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: note.message }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-slate-500">No updates at this time</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
