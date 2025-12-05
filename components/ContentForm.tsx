'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('@/components/JoditEditor'), {
    ssr: false,
});

interface ContentFormProps {
    onSubmit: (formData: FormData) => void;
    initialData?: {
        title: string;
        language: string;
        order: number;
        body: string;
    };
    submitLabel?: string;
}

export default function ContentForm({ onSubmit, initialData, submitLabel = 'Add Section' }: ContentFormProps) {
    const [content, setContent] = useState<string>(initialData?.body || '');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Add editor data
        formData.set('body', content);

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        defaultValue={initialData?.title}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Language</label>
                    <select
                        name="language"
                        defaultValue={initialData?.language || 'en'}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="en">English</option>
                        <option value="te">Telugu</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Order</label>
                    <input
                        type="number"
                        name="order"
                        defaultValue={initialData?.order || 0}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Body</label>
                <div className="bg-slate-800 text-slate-400 border border-slate-700 rounded-md overflow-hidden">
                    <JoditEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Start writing your content..."
                    />
                </div>
            </div>
            <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
                {submitLabel}
            </button>
        </form>
    );
}
