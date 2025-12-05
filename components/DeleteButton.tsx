'use client';

import { useFormStatus } from 'react-dom';

export default function DeleteButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50"
        >
            {pending ? 'Deleting...' : 'Delete'}
        </button>
    );
}
