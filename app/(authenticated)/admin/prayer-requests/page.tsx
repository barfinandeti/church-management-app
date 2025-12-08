import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Heart, AlertCircle, Trash2, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import DeleteButton from '@/components/DeleteButton';
import { deletePrayerRequest } from '@/app/actions/prayer';
import PrayerRequestStatusSelect from '@/components/PrayerRequestStatusSelect';
import SharePrayerRequestButton from '@/components/SharePrayerRequestButton';

export default async function PrayerRequestsAdminPage() {
    const session = await getSession();

    if (!session || (session.user.role !== 'SUPERADMIN' && session.user.role !== 'CHURCH_ADMIN')) {
        redirect('/dashboard');
    }

    const requests = await prisma.prayerRequest.findMany({
        where: session.user.role === 'SUPERADMIN'
            ? {}
            : { churchId: session.user.churchId! },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: [
            { isUrgent: 'desc' },
            { createdAt: 'desc' },
        ],
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white font-playfair">Prayer Requests</h1>
                    <p className="text-slate-400 mt-1">
                        Manage prayer requests from your congregation
                    </p>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-12 text-center">
                    <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No prayer requests yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className={`bg-slate-900/50 rounded-xl border p-6 ${request.isUrgent ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-800'
                                }`}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs text-slate-500">
                                            {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
                                        </span>
                                        {request.isUrgent && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 text-rose-300 text-xs font-medium rounded-full">
                                                <AlertCircle className="w-3 h-3" />
                                                Urgent
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-sm font-medium text-slate-400">Name:</span>
                                            <span className="text-slate-300">{request.name}</span>
                                        </div>
                                        {request.email && (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-medium text-slate-400">Email:</span>
                                                <a href={`mailto:${request.email}`} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {request.email}
                                                </a>
                                            </div>
                                        )}
                                        {request.phone && (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-medium text-slate-400">Phone:</span>
                                                <a href={`tel:${request.phone}`} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {request.phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <p className="text-slate-200 whitespace-pre-wrap">{request.request}</p>
                                    </div>

                                    <div className="text-xs text-slate-500">
                                        Submitted by: {request.user.name || request.user.email}
                                    </div>
                                </div>

                                <div className="flex lg:flex-col gap-2 items-start">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-medium text-slate-400">Status</label>
                                        <div className="flex items-center gap-2">
                                            <PrayerRequestStatusSelect
                                                requestId={request.id}
                                                currentStatus={request.status}
                                            />
                                            <SharePrayerRequestButton request={request} />
                                        </div>
                                    </div>
                                    <form action={deletePrayerRequest.bind(null, request.id)} className="lg:mt-4">
                                        <DeleteButton />
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
