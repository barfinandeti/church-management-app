'use client';

import { useState } from 'react';
import { updateProfile } from '@/app/actions/user';
import { toast } from 'sonner';
import { Save, User, Mail } from 'lucide-react';

interface ProfileFormProps {
    user: {
        name: string | null;
        email: string;
    };
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);

        const result = await updateProfile(formData);

        if (result.success) {
            toast.success('Profile updated successfully');
        } else {
            toast.error(result.error || 'Failed to update profile');
        }
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                    <User className="w-5 h-5" />
                    Personal Information
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Full Name
                        </label>
                        <input
                            name="name"
                            defaultValue={user.name || ''}
                            required
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full pl-10 pr-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
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
