import { prisma } from '@/lib/prisma';
import { updateBookSection } from '@/app/actions/admin';
import ContentForm from '@/components/ContentForm';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditContentPage({ params }: PageProps) {
    const { id } = await params;
    const section = await prisma.bookSection.findUnique({
        where: { id },
    });

    if (!section) {
        notFound();
    }

    async function updateAction(formData: FormData) {
        'use server';
        await updateBookSection(id, formData);
        redirect('/admin/content');
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/content" className="text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-2xl font-bold text-white font-playfair">Edit Section</h2>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <ContentForm
                    initialData={section}
                    onSubmit={updateAction}
                    submitLabel="Update Section"
                />
            </div>
        </div>
    );
}
