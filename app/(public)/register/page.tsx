import { prisma } from '@/lib/prisma';
import RegisterForm from '@/components/RegisterForm';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
    const churches = await prisma.church.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true }
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white font-playfair">Join Your Church</h2>
                    <p className="mt-2 text-sm text-slate-400">Create an account to access member features</p>
                </div>

                <RegisterForm churches={churches} />

                <div className="mt-6 text-center text-xs text-slate-500">
                    <p>Already have an account? <a href="/admin/login" className="text-indigo-400 hover:text-indigo-300">Sign in</a></p>
                </div>
            </div>
        </div>
    );
}
