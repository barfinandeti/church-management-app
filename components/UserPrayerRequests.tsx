'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { AlertCircle, Edit2, Trash2 } from 'lucide-react';
import DeleteButton from '@/components/DeleteButton';
import EditPrayerRequestForm from '@/components/EditPrayerRequestForm';
import { updatePrayerRequest } from '@/app/actions/updatePrayerRequest';

interface PrayerRequest {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    request: string;
    isUrgent: boolean;
    status: string;
    createdAt: Date;
}

interface UserPrayerRequestsProps {
    requests: PrayerRequest[];
    deletePrayerRequest: (id: string) => void;
}

export default function UserPrayerRequests({ requests, deletePrayerRequest }: UserPrayerRequestsProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

    if (requests.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white font-playfair">Your Recent Requests</h2>
            <div className="space-y-3">
                {requests.map((request) => (
                    <div
                        key={request.id}
                        className={`bg-slate-900/50 rounded-xl border p-4 ${request.isUrgent ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-800'
                            }`}
                    >
                        {editingId === request.id ? (
                            <EditPrayerRequestForm
                                request={request}
                                onSubmit={updatePrayerRequest}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs text-slate-500">
                                            {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
                                        </span>
                                        {request.isUrgent && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 text-rose-300 text-xs font-medium rounded-full">
                                                <AlertCircle className="w-3 h-3" />
                                                Urgent
                                            </span>
                                        )}
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                                request.status === 'praying' ? 'bg-blue-500/20 text-blue-300' :
                                                    'bg-green-500/20 text-green-300'
                                            }`}>
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 text-sm">{request.request}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingId(request.id)}
                                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <form action={deletePrayerRequest.bind(null, request.id)}>
                                        <DeleteButton />
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
