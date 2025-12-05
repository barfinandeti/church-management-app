import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, Calendar, Bell, Video, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    // Fetch statistics
    const [sectionsCount, notificationsCount, weeksCount, liveConfig] = await Promise.all([
        prisma.bookSection.count(),
        prisma.notification.count(),
        prisma.weeklySchedule.count(),
        prisma.liveStreamConfig.findFirst(),
    ]);

    const stats = [
        {
            label: 'Book Sections',
            value: sectionsCount,
            icon: BookOpen,
            href: '/admin/content',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
        },
        {
            label: 'Notifications',
            value: notificationsCount,
            icon: Bell,
            href: '/admin/notifications',
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
        },
        {
            label: 'Weekly Schedules',
            value: weeksCount,
            icon: Calendar,
            href: '/admin/schedule',
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
        },
        {
            label: 'Live Stream',
            value: liveConfig?.isLive ? 'Active' : 'Offline',
            icon: Video,
            href: '/admin/live',
            color: 'text-red-400',
            bgColor: 'bg-red-500/10',
        },
    ];

    const quickActions = [
        {
            title: 'Worship Content',
            description: 'Manage prayers, psalms, and liturgical texts',
            href: '/admin/content',
            icon: BookOpen,
            color: 'from-blue-500 to-indigo-500',
        },
        {
            title: 'Schedule',
            description: 'Plan weekly worship services and events',
            href: '/admin/schedule',
            icon: Calendar,
            color: 'from-green-500 to-emerald-500',
        },
        {
            title: 'Notifications',
            description: 'Send announcements to congregation',
            href: '/admin/notifications',
            icon: Bell,
            color: 'from-yellow-500 to-orange-500',
        },
        {
            title: 'Live Stream',
            description: 'Configure YouTube live streaming',
            href: '/admin/live',
            icon: Video,
            color: 'from-red-500 to-pink-500',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white font-playfair">Dashboard</h1>
                <p className="text-slate-400 mt-2">Welcome to the Order of Worship Admin Panel</p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-300 hover:scale-105 group"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                                </div>
                                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-300 overflow-hidden"
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-linear-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                <div className="relative flex items-start gap-4">
                                    <div className={`bg-linear-to-br ${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                            {action.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm mt-1">{action.description}</p>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* System Status */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Database</span>
                        <span className="flex items-center gap-2 text-green-400">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            Connected
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Live Stream</span>
                        <span className={`flex items-center gap-2 ${liveConfig?.isLive ? 'text-red-400' : 'text-slate-500'}`}>
                            <span className={`w-2 h-2 ${liveConfig?.isLive ? 'bg-red-400 animate-pulse' : 'bg-slate-500'} rounded-full`} />
                            {liveConfig?.isLive ? 'Broadcasting' : 'Offline'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Content Sections</span>
                        <span className="text-blue-400">{sectionsCount} items</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
