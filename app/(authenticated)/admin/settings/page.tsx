import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
    const session = await requireAdmin();
    const churchId = session.user.churchId;

    if (!churchId) {
        return <div>Error: No church context found</div>;
    }

    const church = await prisma.church.findUnique({
        where: { id: churchId },
        select: { name: true, address: true },
    });

    if (!church) {
        return <div>Error: Church not found</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your church details</p>
                </div>
            </div>

            <SettingsForm initialData={church} />
        </div>
    );
}
