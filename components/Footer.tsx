import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0F172B] border-t border-slate-800 text-slate-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                    {/* Brand / Logo */}
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-900/50 border border-slate-700/50 p-2">
                            <Image
                                src="/Dan-Dav-logo-round.png"
                                alt="Dan & Dav Logo"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white font-playfair tracking-wide">
                                Dan & Dav
                            </span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">
                                Media & Technology
                            </span>
                        </div>
                    </div>

                    {/* Copyright - Center on Desktop */}
                    <div className="text-center md:text-left">
                        <p className="text-sm text-slate-500">
                            &copy; {currentYear} Dan & Dav. All rights reserved.
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-6">
                        <SocialLink
                            href="https://www.facebook.com/profile.php?id=61583619750523"
                            icon="/icons/facebook.png" // Fallback or use the URL directly if external
                            externalSrc="https://img.icons8.com/fluency/48/facebook-new.png"
                            label="Facebook"
                        />
                        <SocialLink
                            href="https://www.instagram.com/dan__and__dav__media/"
                            icon="/icons/instagram.png"
                            externalSrc="https://img.icons8.com/fluency/48/instagram-new.png"
                            label="Instagram"
                        />
                        <SocialLink
                            href="https://www.youtube.com/@Dan-and-Dav-Media"
                            icon="/icons/youtube.png"
                            externalSrc="https://img.icons8.com/fluency/48/youtube-play.png"
                            label="YouTube"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, externalSrc, label }: { href: string, icon: string, externalSrc: string, label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1"
            aria-label={label}
        >
            <div className="relative w-6 h-6 transition-transform group-hover:scale-110">
                {/* Using standard img tag for external icons to avoid Next.js Image config issues for now */}
                <img
                    src={externalSrc}
                    alt={label}
                    className="w-full h-full object-contain opacity-90 group-hover:opacity-100"
                />
            </div>
        </a>
    );
}
