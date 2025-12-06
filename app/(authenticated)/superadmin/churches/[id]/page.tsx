import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import ChurchEditForm from '@/components/ChurchEditForm';
import { notFound } from 'next/navigation';

export default async function EditChurchPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await requireSuperAdmin();

    const church = await prisma.church.findUnique({
        where: { id },
    });

    if (!church) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">Edit Church</h1>
            <ChurchEditForm church={church} />
        </div>
    );
}
