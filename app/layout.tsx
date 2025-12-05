import type { Metadata, Viewport } from 'next';
import { inter, playfair, notoSansTelugu, notoSerifTelugu, sreeKrushnadevaraya } from './fonts';
import './globals.css';
import ServiceWorkerRegister from './sw-register';
import Navbar from '@/components/Navbar';
import DisableRightClick from '@/components/DisableRightClick';
import { Toaster } from '@/components/Toaster';
import { clsx } from 'clsx';

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
    themeColor: '#f8fafc',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={clsx(
                inter.variable,
                playfair.variable,
                notoSansTelugu.variable,
                notoSerifTelugu.variable,
                sreeKrushnadevaraya.variable
            )}
        >
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/icons/icon-192.png" />
            </head>
            <body suppressHydrationWarning className="bg-linear-to-br from-background via-secondary/30 to-background text-foreground min-h-screen font-sans antialiased selection:bg-primary/20">
                <DisableRightClick />
                <Toaster />
                <ServiceWorkerRegister />
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                        {children}
                    </main>

                    {/* Elegant footer */}
                    <footer className="w-full border-t border-border/40 bg-white/30 dark:bg-[#0F172B] backdrop-blur-md mt-auto relative z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

                                {/* Left – Logo */}
                                <div className="flex items-center gap-5">
                                    <img
                                        src="/Dan-Dav-logo-round.png"
                                        alt="CSI Church Logo"
                                        className="h-20 w-auto object-contain"
                                    />

                                </div>
                                {/* Bottom text */}
                                <div className="mt-6 text-center">
                                    <span className="text-sm font-semibold text-white">
                                        Dan &amp; Dav
                                    </span>
                                    <p className="text-xs text-white/70 font-light">
                                        © {new Date().getFullYear()} All rights reserved
                                    </p>
                                </div>

                                {/* Right – Social Icons */}
                                <div className="flex items-center gap-5">
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61583619750523"
                                        target="_blank"
                                        className="text-white/80 hover:text-white transition"
                                    >
                                        <img width="48" height="48" src="https://img.icons8.com/fluency/48/facebook-new.png" alt="facebook-new" />
                                    </a>

                                    <a
                                        href="https://www.instagram.com/dan__and__dav__media/"
                                        target="_blank"
                                        className="text-white/80 hover:text-white transition"
                                    >
                                        <img width="48" height="48" src="https://img.icons8.com/fluency/48/instagram-new.png" alt="instagram-new" />
                                    </a>

                                    <a
                                        href="https://www.youtube.com/@Dan-and-Dav-Media"
                                        target="_blank"
                                        className="text-white/80 hover:text-white transition"
                                    >
                                        <img width="48" height="48" src="https://img.icons8.com/fluency/48/youtube-play.png" alt="youtube-play" />
                                    </a>
                                </div>
                            </div>


                        </div>
                    </footer>

                </div>
            </body>
        </html>
    );
}