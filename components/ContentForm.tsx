// 'use client';

// import { useState, useTransition } from 'react';
// import dynamic from 'next/dynamic';
// import { toast } from 'sonner';

// const JoditEditor = dynamic(() => import('@/components/JoditEditor'), {
//     ssr: false,
// });

// interface ContentFormProps {
//     onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string } | void>;
//     initialData?: {
//         title: string;
//         language: string;
//         order: number;
//         body: string;
//     };
//     submitLabel?: string;
// }

// export default function ContentForm({ onSubmit, initialData, submitLabel = 'Add Section' }: ContentFormProps) {
//     const [content, setContent] = useState<string>(initialData?.body || '');
//     const [isPending, startTransition] = useTransition();

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const formData = new FormData(e.currentTarget);

//         // Add editor data
//         formData.set('body', content);

//         startTransition(async () => {
//             const result = await onSubmit(formData);

//             if (result?.success === false) {
//                 toast.error(result.error || 'Failed to save content');
//             } else if (result?.success) {
//                 toast.success('Content saved successfully!');
//                 if (!initialData) {
//                     // Clear form for new entries
//                     e.currentTarget.reset();
//                     setContent('');
//                 }
//             }
//         });
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
//                     <input
//                         type="text"
//                         name="title"
//                         required
//                         defaultValue={initialData?.title}
//                         className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-slate-400 mb-1">Language</label>
//                     <select
//                         name="language"
//                         defaultValue={initialData?.language || 'en'}
//                         className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
//                     >
//                         <option value="en">English</option>
//                         <option value="te">Telugu</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-slate-400 mb-1">Order</label>
//                     <input
//                         type="number"
//                         name="order"
//                         defaultValue={initialData?.order || 0}
//                         className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                 </div>
//             </div>
//             <div>
//                 <label className="block text-sm font-medium text-slate-400 mb-1">Body</label>
//                 <div className="bg-slate-800 text-slate-400 border border-slate-700 rounded-md overflow-hidden">
//                     <JoditEditor
//                         content={content}
//                         onChange={setContent}
//                         placeholder="Start writing your content..."
//                     />
//                 </div>
//             </div>
//             <button
//                 type="submit"
//                 disabled={isPending}
//                 className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
//             >
//                 {isPending ? 'Saving...' : submitLabel}
//             </button>
//         </form>
//     );
// }

'use client';

import { useState, useTransition, useRef } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const JoditEditor = dynamic(() => import('@/components/JoditEditor'), {
    ssr: false,
});

import ChurchSelector from './ChurchSelector';

interface ContentFormProps {
    onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string } | void>;
    initialData?: {
        title: string;
        language: string;
        order: number;
        body: string;
    };
    submitLabel?: string;
    churches?: { id: string; name: string }[];
}

export default function ContentForm({ onSubmit, initialData, submitLabel = 'Add Section', churches }: ContentFormProps) {
    const [content, setContent] = useState(initialData?.body || '');
    const [isPending, startTransition] = useTransition();

    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Add editor content
        formData.set('body', content);

        startTransition(async () => {
            const result = await onSubmit(formData);

            if (result?.success === false) {
                toast.error(result.error || 'Failed to save content');
            } else {
                toast.success('Content saved successfully!');

                // Clear form ONLY when adding a new section
                if (!initialData && formRef.current) {
                    formRef.current.reset();
                    setContent('');
                }
            }
        });
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {churches && churches.length > 0 && (
                <ChurchSelector churches={churches} />
            )}

            {/* input fields remain unchanged */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        defaultValue={initialData?.title}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Language</label>
                    <select
                        name="language"
                        defaultValue={initialData?.language || 'en'}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200"
                        disabled={!!initialData} // Disable language change when editing
                    >
                        <option value="en">English</option>
                        <option value="te">Telugu</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Body</label>
                <div className="bg-slate-800 border border-slate-700 rounded-md overflow-hidden">
                    <JoditEditor content={content} onChange={setContent} />
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white px-4 py-2 rounded-md text-sm"
            >
                {isPending ? 'Saving...' : submitLabel}
            </button>
        </form>
    );
}
