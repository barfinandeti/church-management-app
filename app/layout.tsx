import type { Metadata, Viewport } from 'next';
import { inter, playfair, notoSansTelugu, notoSerifTelugu, sreeKrushnadevaraya } from './fonts';
import './globals.css';
import ServiceWorkerRegister from './sw-register';
import DisableRightClick from '@/components/DisableRightClick';
import { Toaster } from '@/components/Toaster';

export const metadata: Metadata = {
    title: 'Church Management App',
    description: 'Complete church management system with order of worship, notifications, schedule management, and live streaming',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Church Management App',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable} ${notoSansTelugu.variable} ${notoSerifTelugu.variable} ${sreeKrushnadevaraya.variable}`}>
            <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen flex flex-col`}>
                <DisableRightClick />
                {children}
                <Toaster />
                <ServiceWorkerRegister />
            </body>
        </html>
    );
}