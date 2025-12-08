'use client';

import { useState, useTransition, useRef } from 'react';
import { toast } from 'sonner';

interface PrayerRequestFormProps {
    onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
    userEmail?: string;
}

export default function PrayerRequestForm({ onSubmit, userEmail }: PrayerRequestFormProps) {
    const [isPending, startTransition] = useTransition();
    const [isUrgent, setIsUrgent] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('isUrgent', isUrgent.toString());

        startTransition(async () => {
            const result = await onSubmit(formData);

            if (result?.success === false) {
                toast.error(result.error || 'Failed to submit prayer request');
            } else {
                toast.success('Prayer request submitted successfully! Our pastors will pray for you.');
                if (formRef.current) {
                    formRef.current.reset();
                }
                setIsUrgent(false);
            }
        });
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                    Your Name <span className="text-rose-400">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="John Doe"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Email (Optional)</label>
                    <input
                        type="email"
                        name="email"
                        defaultValue={userEmail}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Phone (Optional)</label>
                    <input
                        type="tel"
                        name="phone"
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="+1234567890"
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
                    rows={6}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    placeholder="Share your prayer request here..."
                />
                <p className="text-xs text-slate-500 mt-1">
                    Your request will be kept confidential and shared only with church leadership.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isUrgent"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-slate-700 rounded bg-slate-800"
                />
                <label htmlFor="isUrgent" className="text-sm text-slate-300">
                    <span className="font-medium text-rose-400">Urgent:</span> This requires immediate prayer attention
                </label>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white px-4 py-3 rounded-md font-medium transition-colors"
            >
                {isPending ? 'Submitting...' : 'Submit Prayer Request'}
            </button>
        </form>
    );
}
