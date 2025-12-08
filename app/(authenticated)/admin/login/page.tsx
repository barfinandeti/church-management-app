'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Login successful');

                // Redirect based on role
                if (data.user.role === 'SUPERADMIN') {
                    router.push('/superadmin');
                } else if (data.user.role === 'CHURCH_ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard'); // Member dashboard (to be created)
                }
            } else {
                toast.error(data.error || 'Login failed');
            }
        } catch (error) {
            toast.error('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white font-playfair">Welcome Back</h2>
                    <p className="mt-2 text-sm text-slate-400">Sign in to access your dashboard</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                                placeholder="admin@church.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 pr-10 bg-slate-800 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-slate-400 hover:text-slate-300 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500">
                    <p>Don't have an account? <a href="/register" className="text-indigo-400 hover:text-indigo-300">Register here</a></p>
                </div>

                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg text-xs text-slate-400 space-y-2">
                    <p className="font-semibold text-slate-300">Demo Credentials:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="block text-indigo-400">Super Admin:</span>
                            superadmin@example.com
                        </div>
                        <div>
                            <span className="block text-indigo-400">Church Admin:</span>
                            admin@stmarys.com
                        </div>
                    </div>
                    <p className="pt-2 text-center text-slate-500">Password: password123</p>
                </div>
            </div>
        </div>
    );
}
