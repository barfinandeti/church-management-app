'use client';

import { updateChurchDetails } from '@/app/actions/superadmin';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Church } from '@prisma/client';

type ChurchEditFormProps = {
    church: Church;
};

export default function ChurchEditForm({ church }: ChurchEditFormProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await updateChurchDetails(church.id, formData);
            if (result.success) {
                toast.success('Church updated successfully!');
                router.refresh();
                router.push('/superadmin');
            } else {
                toast.error(result.error || 'Failed to update church');
            }
        });
    };

    return (
        <form action={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Church Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Church Name</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={church.name}
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            defaultValue={church.slug}
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                    <textarea
                        name="address"
                        rows={3}
                        defaultValue={church.address || ''}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Church Email</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={church.email || ''}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            defaultValue={church.phoneNumber || ''}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
