import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSession } from '@/lib/auth';

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar session={session} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
