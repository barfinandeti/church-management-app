import { createPrayerRequest } from '@/app/actions/prayer';
import PrayerRequestForm from '@/components/PrayerRequestForm';
import UserPrayerRequests from '@/components/UserPrayerRequests';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Heart } from 'lucide-react';
import { deletePrayerRequest } from '@/app/actions/prayer';

export default async function PrayerRequestPage() {
    const session = await getSession();

    if (!session) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Please log in to submit a prayer request</p>
            </div>
        );
    }

    // Fetch user's previous prayer requests
    const userRequests = await prisma.prayerRequest.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white font-playfair">Prayer Request</h1>
                    <p className="text-slate-400 mt-1">
                        We are here to pray with you and for you
                    </p>
                </div>
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/20 text-indigo-300 p-4 rounded-lg">
                <p className="text-sm">
                    <strong>How it works:</strong> Your prayer request will be submitted to our church leadership who will lift your needs in prayer. All requests are kept confidential.
                </p>
            </div>

            {/* Hide form for admins */}
            {(session.user.role === 'SUPERADMIN' || session.user.role === 'CHURCH_ADMIN') ? (
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl text-center">
                    <p className="text-slate-400">
                        As an administrator, you can manage prayer requests in the{' '}
                        <a href="/admin/prayer-requests" className="text-indigo-400 hover:text-indigo-300 underline">
                            Admin Dashboard
                        </a>
                        .
                    </p>
                </div>
            ) : (
                <PrayerRequestForm onSubmit={createPrayerRequest} userEmail={session.user.email} />
            )}

            <UserPrayerRequests requests={userRequests} deletePrayerRequest={deletePrayerRequest} />
        </div>
    );
}
