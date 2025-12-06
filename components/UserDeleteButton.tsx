'use client';

import { deleteUser } from '@/app/actions/users';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

export default function UserDeleteButton({ userId }: { userId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        startTransition(async () => {
            const result = await deleteUser(userId);
            if (result.success) {
                toast.success('User deleted successfully');
            } else {
                toast.error(result.error || 'Failed to delete user');
            }
        });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
            title="Delete User"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
