'use client';

import { useFormStatus } from 'react-dom';
import { Trash2 } from 'lucide-react';

export default function DeleteButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
            title={pending ? 'Deleting...' : 'Delete'}
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
