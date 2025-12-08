'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface EditPrayerRequestFormProps {
    request: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        request: string;
        isUrgent: boolean;
    };
    onSubmit: (id: string, formData: FormData) => Promise<{ success: boolean; error?: string }>;
    onCancel: () => void;
}

export default function EditPrayerRequestForm({ request, onSubmit, onCancel }: EditPrayerRequestFormProps) {
    const [isPending, startTransition] = useTransition();
    const [isUrgent, setIsUrgent] = useState(request.isUrgent);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('isUrgent', isUrgent.toString());

        startTransition(async () => {
            const result = await onSubmit(request.id, formData);

            if (result?.success === false) {
                toast.error(result.error || 'Failed to update prayer request');
            } else {
                toast.success('Prayer request updated successfully!');
                onCancel();
            }
        });
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                    Your Name <span className="text-rose-400">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    required
                    defaultValue={request.name}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        defaultValue={request.email || ''}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        defaultValue={request.phone || ''}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                    Prayer Request <span className="text-rose-400">*</span>
                </label>
                <textarea
                    name="request"
                    required
                    rows={4}
                    defaultValue={request.request}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isUrgent-edit"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-slate-700 rounded bg-slate-800"
                />
                <label htmlFor="isUrgent-edit" className="text-sm text-slate-300">
                    <span className="font-medium text-rose-400">Urgent:</span> This requires immediate prayer attention
                </label>
            </div>

            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
                >
                    {isPending ? 'Updating...' : 'Update Request'}
                </button>
            </div>
        </form>
    );
}
