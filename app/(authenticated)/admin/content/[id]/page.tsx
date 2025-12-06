import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import ContentForm from '@/components/ContentForm';
import { updateBookSection } from '@/app/actions/admin';
import { notFound } from 'next/navigation';

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await requireAdmin();

    const section = await prisma.bookSection.findUnique({
        where: { id },
    });

    if (!section) {
        notFound();
    }

    // Permission check
    if (session.user.role !== 'SUPERADMIN' && section.churchId !== session.user.churchId) {
        notFound();
    }

    // Fetch churches for dropdown (only needed for SUPERADMIN)
    const churches = session.user.role === 'SUPERADMIN'
        ? await prisma.church.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } })
        : [];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">Edit Content</h1>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <ContentForm
                    initialData={section}
                    onSubmit={updateBookSection.bind(null, section.id)}
                    submitLabel="Update Section"
                    churches={churches}
                />
            </div>
        </div>
    );
}
