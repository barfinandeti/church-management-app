import { prisma } from '@/lib/prisma';
import { updateNotification } from '@/app/actions/admin';
import NotificationForm from '@/components/NotificationForm';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditNotificationPage({ params }: PageProps) {
    const { id } = await params;
    const notification = await prisma.notification.findUnique({
        where: { id },
    });

    if (!notification) {
        notFound();
    }

    async function updateAction(formData: FormData) {
        'use server';
        await updateNotification(id, formData);
        redirect('/admin/notifications');
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/notifications" className="text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-2xl font-bold text-white font-playfair">Edit Notification</h2>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <NotificationForm
                    initialData={notification}
                    onSubmit={updateAction}
                    submitLabel="Update Notification"
                />
            </div>
        </div>
    );
}
