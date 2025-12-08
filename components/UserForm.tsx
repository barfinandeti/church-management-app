'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

interface Church {
    id: string;
    name: string;
}

interface UserFormProps {
    currentUserRole: string;
    currentUserChurchId: string | null;
    churches: Church[];
}

export default function UserForm({ currentUserRole, currentUserChurchId, churches }: UserFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        churchId: currentUserChurchId || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('User created successfully');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'USER',
                    churchId: currentUserChurchId || '',
                });
                router.refresh();
            } else {
                toast.error(data.error || 'Failed to create user');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Create New User</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 pr-10 text-slate-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200"
                    >
                        <option value="USER">User</option>
                        <option value="CHURCH_ADMIN">Church Admin</option>
                        {currentUserRole === 'SUPERADMIN' && (
                            <option value="SUPERADMIN">Super Admin</option>
                        )}
                    </select>
                </div>

                {currentUserRole === 'SUPERADMIN' && formData.role !== 'SUPERADMIN' && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Church</label>
                        <select
                            value={formData.churchId}
                            onChange={(e) => setFormData({ ...formData, churchId: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200"
                            required={formData.role !== 'SUPERADMIN'}
                        >
                            <option value="">Select a church...</option>
                            {churches.map((church) => (
                                <option key={church.id} value={church.id}>
                                    {church.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    {isLoading ? 'Creating...' : 'Create User'}
                </button>
            </div>
        </form>
    );
}
