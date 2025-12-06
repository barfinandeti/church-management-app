import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import UserEditForm from '@/components/UserEditForm';
import { notFound } from 'next/navigation';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await requireAdmin();

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        notFound();
    }

    // Permission check: Church Admin can only edit users in their church
    if (session.user.role !== 'SUPERADMIN' && user.churchId !== session.user.churchId) {
        notFound(); // Or redirect/error
    }

    // Fetch churches for dropdown (only needed for SUPERADMIN)
    const churches = session.user.role === 'SUPERADMIN'
        ? await prisma.church.findMany({ orderBy: { name: 'asc' } })
        : [];

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">Edit User</h1>
            <UserEditForm
                user={user}
                currentUserRole={session.user.role}
                churches={churches}
            />
        </div>
    );
}
