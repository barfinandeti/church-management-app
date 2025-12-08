import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import Breadcrumb from '@/components/Breadcrumb';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar - Desktop Only */}
            <Sidebar session={session} />

            {/* Main Content */}
            <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 pb-20 md:pb-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumb />
                    {children}
                </div>
            </main>

            {/* Bottom Navigation - Mobile Only */}
            <BottomNav session={session} />
        </div>
    );
}
