import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileForm from './ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const session = await requireSession();

    // Fetch fresh user data
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true },
    });

    if (!user) {
        return <div>Error: User not found</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">My Profile</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account settings</p>
            </div>

            <ProfileForm user={user} />
        </div>
    );
}
