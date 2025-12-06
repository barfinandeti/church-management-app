'use client';

import { useState } from 'react';
import { updateChurch } from '@/app/actions/admin';
import { toast } from 'sonner';
import { Save, Building, MapPin } from 'lucide-react';

interface SettingsFormProps {
    initialData: {
        name: string;
        address: string | null;
    };
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);

        const result = await updateChurch(formData);

        if (result.success) {
            toast.success('Settings updated successfully');
        } else {
            toast.error(result.error || 'Failed to update settings');
        }
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                    <Building className="w-5 h-5" />
                    Church Details
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Church Name
                        </label>
                        <input
                            name="name"
                            defaultValue={initialData.name}
                            required
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Address
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <textarea
                                name="address"
                                defaultValue={initialData.address || ''}
                                rows={3}
                                className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </form>
    );
}
