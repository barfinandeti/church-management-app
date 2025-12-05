'use client';

import React, { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Import Jodit dynamically to avoid SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface JoditEditorProps {
    content: string;
    onChange: (newContent: string) => void;
    placeholder?: string;
    className?: string;
}

export default function JoditEditorComponent({
    content,
    onChange,
    placeholder,
    className
}: JoditEditorProps) {
    const editor = useRef(null);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || 'Start typing...',
        height: 400,
        width: '100%',
        enableDragAndDropFileToEditor: true,
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'ul', 'ol', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'table', 'link', '|',
            'left', 'center', 'right', 'justify', '|',
            'undo', 'redo', '|',
            'hr', 'eraser', 'fullsize',
        ],
        uploader: {
            insertImageAsBase64URI: true
        },
        removeButtons: ['about', 'print', 'file'],
        showXPathInStatusbar: false,
        showCharsCounter: false,
        showWordsCounter: false,
        toolbarAdaptive: false,
        theme: 'dark', // Assuming dark mode based on previous context, but can be adjusted
        style: {
            background: '#1e293b', // slate-800
            color: '#e2e8f0', // slate-200
            borderColor: '#334155' // slate-700
        }
    }), [placeholder]);

    return (
        <div className={className}>
            <JoditEditor
                ref={editor}
                value={content}
                config={config as any}
                onBlur={(newContent) => onChange(newContent)} // preferred to use onBlur for performance
                onChange={() => { }} // empty handler to avoid readonly warning if needed, but onBlur is main trigger
            />
        </div>
    );
}
