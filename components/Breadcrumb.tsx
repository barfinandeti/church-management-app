'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';

// Map of path segments to human-readable labels
const pathLabelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    admin: 'Admin',
    content: 'Worship Content',
    schedule: 'Schedule',
    notifications: 'Notifications',
    live: 'Live Stream',
    users: 'Users',
    reader: 'Order of Service',
    profile: 'Profile',
    superadmin: 'Super Admin',
    churches: 'Churches',
    new: 'New',
    settings: 'Settings',
    login: 'Login',
};

interface BreadcrumbItem {
    label: string;
    href: string;
}

export default function Breadcrumb() {
    const pathname = usePathname();

    // Don't show breadcrumbs on the dashboard home page
    if (pathname === '/dashboard') {
        return null;
    }

    // Parse pathname into segments
    const segments = pathname.split('/').filter(Boolean);

    // Build breadcrumb items
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/dashboard' }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
        // Skip 'dashboard' since we already have it as the home
        if (segment === 'dashboard') return;

        currentPath += `/${segment}`;

        // For dynamic routes like [id], show the actual ID or a placeholder
        let label = pathLabelMap[segment] || segment;

        // If it looks like a UUID or ID, show it as "Details" or the actual value
        if (segment.match(/^[0-9a-f-]{36}$|^[0-9]+$/)) {
            label = `#${segment.slice(0, 8)}`;
        }

        // Capitalize if not in map
        if (!pathLabelMap[segment] && !segment.match(/^[0-9a-f-]{36}$|^[0-9]+$/)) {
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
        }

        breadcrumbItems.push({
            label,
            href: currentPath,
        });
    });

    return (
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
            <Link
                href="/dashboard"
                className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
            </Link>

            {breadcrumbItems.slice(1).map((item, index) => {
                const isLast = index === breadcrumbItems.length - 2;

                return (
                    <Fragment key={item.href}>
                        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                        {isLast ? (
                            <span className="text-slate-900 dark:text-white font-medium">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </Fragment>
                );
            })}
        </nav>
    );
}
