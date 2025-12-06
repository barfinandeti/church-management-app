'use client';

import { useState, useEffect } from 'react';
import { createChurch, getChurches } from '@/app/actions/superadmin';
import { toast } from 'sonner';
import { Plus, Building, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

export default function ChurchesPage() {
    const [churches, setChurches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadChurches();
    }, []);

    const loadChurches = async () => {
        const data = await getChurches();
        setChurches(data);
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        const formData = new FormData(e.currentTarget);

        const result = await createChurch(formData);

        if (result.success) {
            toast.success('Church created successfully');
            (e.target as HTMLFormElement).reset();
            loadChurches();
        } else {
            toast.error(result.error || 'Failed to create church');
        }
        setIsCreating(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">Churches</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage all registered churches</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Church Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm sticky top-8">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add New Church
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Church Name
                                </label>
                                <input
                                    name="name"
                                    required
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="St. Mary's Church"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Slug (URL Identifier)
                                </label>
                                <input
                                    name="slug"
                                    required
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="st-marys"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    rows={3}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="123 Church St, City"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {isCreating ? 'Creating...' : 'Create Church'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Churches List */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-slate-500">Loading churches...</div>
                    ) : churches.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <Building className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                            <p className="text-slate-500">No churches found</p>
                        </div>
                    ) : (
                        churches.map((church) => (
                            <Link
                                href={`/superadmin/churches/${church.id}`}
                                key={church.id}
                                className="block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {church.name}
                                        </h3>
                                        <p className="text-sm text-indigo-500 font-medium mt-1">/{church.slug}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                        <Users className="w-4 h-4" />
                                        <span>{church._count?.users || 0} Users</span>
                                    </div>
                                </div>
                                {church.address && (
                                    <div className="mt-4 flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                        <p>{church.address}</p>
                                    </div>
                                )}
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex justify-between">
                                    <span>ID: {church.id}</span>
                                    <span>Created: {new Date(church.createdAt).toLocaleDateString()}</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
