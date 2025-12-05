import { prisma } from '@/lib/prisma';
import { createBookSection, deleteBookSection } from '@/app/actions/admin';
import DeleteButton from '@/components/DeleteButton';
import ContentForm from '@/components/ContentForm';
import Link from 'next/link';
import { Edit2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
    const sections = await prisma.bookSection.findMany({
        orderBy: { order: 'asc' },
    });

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-playfair">Worship Content</h2>

            {/* Add New Section */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Add New Section</h3>
                <ContentForm onSubmit={createBookSection} />
            </div>

            {/* List Sections */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-800">
                    <thead className="bg-slate-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Lang</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {sections.map((section) => (
                            <tr key={section.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{section.order}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{section.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 uppercase">{section.language}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/content/${section.id}`}
                                            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <form action={deleteBookSection.bind(null, section.id)}>
                                            <DeleteButton />
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
