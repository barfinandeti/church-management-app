// 'use client';

// import { useState, useMemo } from 'react';
// import { clsx } from 'clsx';
// import { BookSection } from '@prisma/client';

// type ReaderViewProps = {
//     sections: BookSection[];
// };

// function normalizeBody(rawBody: string | null | undefined): string {
//     if (!rawBody) return '';

//     let html = rawBody;

//     // If body is still Editor.js JSON, convert it
//     try {
//         const parsed = JSON.parse(rawBody) as {
//             blocks?: { id: string; type: string; data?: { text?: string } }[];
//         };

//         if (parsed.blocks && Array.isArray(parsed.blocks)) {
//             html = parsed.blocks
//                 .map((block) => {
//                     if (block.type === 'paragraph' && block.data?.text) {
//                         return `<p>${block.data.text}</p>`;
//                     }
//                     return '';
//                 })
//                 .filter(Boolean)
//                 .join('');
//         }
//     } catch {
//         // not JSON → just use rawBody as HTML
//         html = rawBody;
//     }

//     // Strip inline styles that fight with our font size & line-height
//     html = html.replace(/style="[^"]*"/g, '');

//     // Optional: strip <span> wrappers (they usually only carry styles)
//     html = html.replace(/<span[^>]*>/g, '');
//     html = html.replace(/<\/span>/g, '');

//     // Extra safety: strip font-* / line-height if they appear in style leftovers
//     html = html.replace(/font-family:[^;"]*;?/gi, '');
//     html = html.replace(/font-size:[^;"]*;?/gi, '');
//     html = html.replace(/line-height:[^;"]*;?/gi, '');

//     return html;
// }

// export default function ReaderView({ sections }: ReaderViewProps) {
//     const [language, setLanguage] = useState<'en' | 'te'>('en');
//     const [fontSize, setFontSize] = useState(18);
//     const [fontFamily, setFontFamily] = useState<string>('var(--font-inter)');
//     const [selectedSectionId, setSelectedSectionId] = useState<string>('');

//     // Filter sections by language
//     const availableSections = useMemo(() => {
//         return sections
//             .filter((s) => s.language === language)
//             .sort((a, b) => a.order - b.order);
//     }, [sections, language]);

//     // Set initial section if none selected
//     useMemo(() => {
//         if (!selectedSectionId && availableSections.length > 0) {
//             setSelectedSectionId(availableSections[0].id);
//         } else if (selectedSectionId && !availableSections.find(s => s.id === selectedSectionId)) {
//             // If switched language and selected id is not valid, pick first
//             if (availableSections.length > 0) {
//                 setSelectedSectionId(availableSections[0].id);
//             } else {
//                 setSelectedSectionId('');
//             }
//         }
//     }, [availableSections, selectedSectionId]);

//     const activeSection = sections.find((s) => s.id === selectedSectionId);

//     const fontOptions = language === 'en'
//         ? [
//             { name: 'Inter', value: 'var(--font-inter)' },
//             { name: 'Playfair', value: 'var(--font-playfair)' },
//         ]
//         : [
//             { name: 'Noto Sans', value: 'var(--font-noto-sans-telugu)' },
//             { name: 'Noto Serif', value: 'var(--font-noto-serif-telugu)' },
//             { name: 'Sree Krushnadevaraya', value: 'var(--font-sree-krushnadevaraya)' },
//         ];

//     // Update font family when language changes if current font is not valid for new language
//     useMemo(() => {
//         const isCurrentFontValid = fontOptions.some(f => f.value === fontFamily);
//         if (!isCurrentFontValid && fontOptions.length > 0) {
//             setFontFamily(fontOptions[0].value);
//         }
//     }, [language, fontOptions, fontFamily]);

//     return (
//         <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
//             {/* Controls */}
//             <div className="bg-slate-900/80 backdrop-blur p-4 rounded-xl border border-slate-800 space-y-4 shrink-0">
//                 <div className="flex flex-wrap gap-4 justify-between items-center">
//                     {/* Language Toggle */}
//                     <div className="flex bg-slate-800 rounded-lg p-1">
//                         <button
//                             onClick={() => setLanguage('en')}
//                             className={clsx(
//                                 'px-3 py-1 rounded-md text-sm font-medium transition-all',
//                                 language === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
//                             )}
//                         >
//                             English
//                         </button>
//                         <button
//                             onClick={() => setLanguage('te')}
//                             className={clsx(
//                                 'px-3 py-1 rounded-md text-sm font-medium transition-all',
//                                 language === 'te' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
//                             )}
//                         >
//                             తెలుగు
//                         </button>
//                     </div>

//                     {/* Font Selector */}
//                     <select
//                         value={fontFamily}
//                         onChange={(e) => setFontFamily(e.target.value)}
//                         className="bg-slate-800 text-slate-200 text-sm rounded-lg border-none focus:ring-2 focus:ring-indigo-500 py-1.5 px-3"
//                     >
//                         {fontOptions.map((f) => (
//                             <option key={f.value} value={f.value}>
//                                 {f.name}
//                             </option>
//                         ))}
//                     </select>

//                     {/* Font Size */}
//                     <div className="flex items-center gap-2">
//                         <span className="text-xs text-slate-200">A-</span>
//                         <input
//                             type="range"
//                             min="14"
//                             max="40"
//                             value={fontSize}
//                             onChange={(e) => setFontSize(Number(e.target.value))}
//                             className="w-24 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
//                         />
//                         <span className="text-sm text-slate-200">A+</span>
//                     </div>
//                 </div>

//                 {/* Section Selector */}
//                 <div className="w-full">
//                     <select
//                         value={selectedSectionId}
//                         onChange={(e) => setSelectedSectionId(e.target.value)}
//                         className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg border-none focus:ring-2 focus:ring-indigo-500 py-2 px-3"
//                     >
//                         {availableSections.length === 0 && <option value="">No sections available</option>}
//                         {availableSections.map(s => (
//                             <option key={s.id} value={s.id}>{s.title}</option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             {/* Reader Content */}
//             <div className="flex-1 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden relative">
//                 {activeSection ? (
//                     <div className="h-full overflow-y-auto p-6 md:p-10 custom-scrollbar">
//                         <h2
//                             className="text-2xl font-bold mb-6 text-center text-indigo-200"
//                             style={{ fontFamily: fontFamily }}
//                         >
//                             {activeSection.title}
//                         </h2>
//                         {/* <div
//                             className="whitespace-pre-wrap leading-relaxed text-slate-200 max-w-2xl mx-auto"
//                             style={{
//                                 fontSize: `${fontSize}px`,
//                                 fontFamily: fontFamily
//                             }}
//                         >
//                             {activeSection.body}
//                         </div> */}
//                         <div
//                             className="leading-relaxed text-slate-200 max-w-2xl mx-auto"
//                             style={{ fontSize: `${fontSize}px`, fontFamily }}
//                             dangerouslySetInnerHTML={{ __html: activeSection.body }}
//                         />
//                         <div className="h-20"></div> {/* Bottom padding */}
//                     </div>
//                 ) : (
//                     <div className="flex items-center justify-center h-full text-slate-500">
//                         <p>Select a section to start reading</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


'use client';

import { useState, useEffect, useMemo } from 'react';
import { clsx } from 'clsx';
import type { BookSection } from '@prisma/client';

type ReaderViewProps = {
    sections: BookSection[];
};

// Helper: normalise + clean body so font-size / line-height are controlled by us
function normalizeBody(rawBody: string | null | undefined): string {
    if (!rawBody) return '';

    let html = rawBody;

    // If body is still Editor.js JSON, convert it
    try {
        const parsed = JSON.parse(rawBody) as {
            blocks?: { id: string; type: string; data?: { text?: string } }[];
        };

        if (parsed.blocks && Array.isArray(parsed.blocks)) {
            html = parsed.blocks
                .map((block) => {
                    if (block.type === 'paragraph' && block.data?.text) {
                        return `<p>${block.data.text}</p>`;
                    }
                    return '';
                })
                .filter(Boolean)
                .join('');
        }
    } catch {
        // not JSON → just use rawBody as HTML
        html = rawBody;
    }

    // Strip inline styles that fight with our font size & line-height
    html = html.replace(/style="[^"]*"/g, '');

    // Optional: strip <span> wrappers (they usually only carry styles)
    html = html.replace(/<span[^>]*>/g, '');
    html = html.replace(/<\/span>/g, '');

    // Extra safety: strip font-* / line-height if they appear in style leftovers
    html = html.replace(/font-family:[^;"]*;?/gi, '');
    html = html.replace(/font-size:[^;"]*;?/gi, '');
    html = html.replace(/line-height:[^;"]*;?/gi, '');

    return html;
}

export default function ReaderView({ sections }: ReaderViewProps) {
    const [language, setLanguage] = useState<'en' | 'te'>('en');
    const [fontSize, setFontSize] = useState(18);
    const [fontFamily, setFontFamily] = useState<string>('var(--font-inter)');
    const [selectedSectionId, setSelectedSectionId] = useState<string>('');

    // 1) Filter sections by language
    const availableSections = useMemo(() => {
        return sections
            .filter((s) => s.language === language)
            .sort((a, b) => a.order - b.order);
    }, [sections, language]);

    // 2) Ensure a valid selectedSectionId
    useEffect(() => {
        if (!selectedSectionId && availableSections.length > 0) {
            setSelectedSectionId(availableSections[0].id);
        } else if (
            selectedSectionId &&
            !availableSections.find((s) => s.id === selectedSectionId)
        ) {
            if (availableSections.length > 0) {
                setSelectedSectionId(availableSections[0].id);
            } else {
                setSelectedSectionId('');
            }
        }
    }, [availableSections, selectedSectionId]);

    const activeSection = useMemo(
        () => sections.find((s) => s.id === selectedSectionId) ?? null,
        [sections, selectedSectionId]
    );

    // 3) Font options per language
    const fontOptions =
        language === 'en'
            ? [
                { name: 'Inter', value: 'var(--font-inter)' },
                { name: 'Playfair', value: 'var(--font-playfair)' },
            ]
            : [
                { name: 'Sree Krushnadevaraya', value: 'var(--font-sree-krushnadevaraya)' },
                { name: 'Noto Sans', value: 'var(--font-noto-sans-telugu)' },
                { name: 'Noto Serif', value: 'var(--font-noto-serif-telugu)' },
            ];

    // 4) Ensure fontFamily is valid for current language
    useEffect(() => {
        const isCurrentFontValid = fontOptions.some((f) => f.value === fontFamily);
        if (!isCurrentFontValid && fontOptions.length > 0) {
            setFontFamily(fontOptions[0].value);
        }
    }, [language, fontOptions, fontFamily]);

    // 5) Clean HTML body for the active section
    const bodyHtml = useMemo(
        () => normalizeBody(activeSection?.body),
        [activeSection?.body]
    );

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            {/* Controls */}
            <div className="bg-slate-900/80 backdrop-blur p-4 rounded-xl border border-slate-800 space-y-4 shrink-0">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    {/* Language Toggle */}
                    <div className="flex bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setLanguage('en')}
                            className={clsx(
                                'px-3 py-1 rounded-md text-sm font-medium transition-all',
                                language === 'en'
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-400 hover:text-slate-200'
                            )}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage('te')}
                            className={clsx(
                                'px-3 py-1 rounded-md text-sm font-medium transition-all',
                                language === 'te'
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-400 hover:text-slate-200'
                            )}
                        >
                            తెలుగు
                        </button>
                    </div>

                    {/* Font Selector */}
                    <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="bg-slate-800 text-slate-200 text-sm rounded-lg border-none focus:ring-2 focus:ring-indigo-500 py-1.5 px-3"
                    >
                        {fontOptions.map((f) => (
                            <option key={f.value} value={f.value}>
                                {f.name}
                            </option>
                        ))}
                    </select>

                    {/* Font Size */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">A-</span>
                        <input
                            type="range"
                            min="14"
                            max="40"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <span className="text-sm text-slate-400">A+</span>
                    </div>
                </div>

                {/* Section Selector */}
                <div className="w-full">
                    <select
                        value={selectedSectionId}
                        onChange={(e) => setSelectedSectionId(e.target.value)}
                        className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg border-none focus:ring-2 focus:ring-indigo-500 py-2 px-3"
                    >
                        {availableSections.length === 0 && (
                            <option value="">No sections available</option>
                        )}
                        {availableSections.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.title} {s.churchId === null ? '(Public)' : ''}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Reader Content */}
            <div className="flex-1 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden relative">
                {activeSection ? (
                    <div className="h-full overflow-y-auto p-6 md:p-10 custom-scrollbar">
                        <h2
                            className="text-2xl font-bold mb-6 text-center text-indigo-200"
                            style={{ fontFamily }}
                        >
                            {activeSection.title}
                        </h2>

                        <div
                            className="leading-relaxed text-slate-200 max-w-2xl mx-auto"
                            style={{
                                fontSize: `${fontSize}px`,
                                fontFamily,
                                // Optional: lock line-height to something consistent
                                lineHeight: 1.8,
                            }}
                            dangerouslySetInnerHTML={{ __html: bodyHtml }}
                        />

                        <div className="h-20" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        <p>Select a section to start reading</p>
                    </div>
                )}
            </div>
        </div>
    );
}
