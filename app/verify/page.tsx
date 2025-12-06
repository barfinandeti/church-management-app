import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VerifyPage(props: {
    searchParams: Promise<{ token?: string }>;
}) {
    const searchParams = await props.searchParams;
    const token = searchParams.token;
    let success = false;
    let message = '';

    if (!token) {
        message = 'Invalid verification link.';
    } else {
        const user = await prisma.user.findFirst({
            where: { verificationToken: token },
        });

        if (!user) {
            message = 'Invalid or expired verification token.';
        } else {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    isVerified: true,
                    verificationToken: null, // Consume token
                },
            });
            success = true;
            message = 'Your email has been verified successfully!';
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="max-w-md w-full bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-2xl text-center">
                <div className="flex justify-center mb-6">
                    {success ? (
                        <div className="p-4 bg-emerald-500/10 rounded-full">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>
                    ) : (
                        <div className="p-4 bg-rose-500/10 rounded-full">
                            <XCircle className="w-12 h-12 text-rose-500" />
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-bold text-white font-playfair mb-2">
                    {success ? 'Verification Successful' : 'Verification Failed'}
                </h2>

                <p className="text-slate-400 mb-8">{message}</p>

                <Link
                    href="/admin/login"
                    className="inline-block w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    Proceed to Login
                </Link>
            </div>
        </div>
    );
}
