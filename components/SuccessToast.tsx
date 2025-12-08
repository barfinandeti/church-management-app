'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function SuccessToast() {
    const searchParams = useSearchParams();
    const success = searchParams.get('success');
    const hasShownToast = useRef(false);

    useEffect(() => {
        if (success === 'true' && !hasShownToast.current) {
            hasShownToast.current = true;
            toast.success('Updated successfully!');
            // Clean up URL
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [success]);

    return null;
}
