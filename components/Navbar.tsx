// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { Home, BookOpen, Calendar, Radio, Sparkles } from 'lucide-react';

// const navItems = [
//     { name: 'Home', href: '/', icon: Home },
//     { name: 'Order of Service', href: '/reader', icon: BookOpen },
//     { name: 'Events', href: '/schedule', icon: Calendar },
//     { name: 'Live Stream', href: '/live', icon: Radio },
//     { name: 'Verse of the Day', href: '/notifications', icon: Sparkles },
// ];

// export default function Navbar() {
//     const pathname = usePathname();

//     return (
//         <nav className="pt-8 pb-6">
//             <div className="max-w-6xl mx-auto px-4">
//                 <motion.div
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                     className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
//                 >
//                     {/* Gradient overlay */}
//                     <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />

//                     {/* Navigation items */}
//                     <div className="relative flex items-center justify-around p-2 gap-1">
//                         {navItems.map((item) => {
//                             const isActive = pathname === item.href;
//                             const Icon = item.icon;

//                             return (
//                                 <Link key={item.name} href={item.href} className="flex-1">
//                                     <motion.div
//                                         whileHover={{ scale: 1.05 }}
//                                         whileTap={{ scale: 0.95 }}
//                                         className="relative"
//                                     >
//                                         <div
//                                             className={`
//                                                 relative px-4 py-3 rounded-2xl transition-all duration-300
//                                                 flex flex-col items-center gap-1.5
//                                                 ${isActive
//                                                     ? 'bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
//                                                     : 'text-slate-200 hover:bg-white/10 hover:text-white'
//                                                 }
//                                             `}
//                                         >
//                                             {/* Icon */}
//                                             <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />

//                                             {/* Text */}
//                                             <span className="text-xs font-medium hidden sm:block">
//                                                 {item.name}
//                                             </span>

//                                             {/* Active indicator - gradient underline */}
//                                             {isActive && (
//                                                 <motion.div
//                                                     layoutId="activeTab"
//                                                     className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-linear-to-r from-pink-400 to-indigo-400 rounded-full"
//                                                     transition={{
//                                                         type: "spring",
//                                                         stiffness: 380,
//                                                         damping: 30
//                                                     }}
//                                                 />
//                                             )}
//                                         </div>
//                                     </motion.div>
//                                 </Link>
//                             );
//                         })}
//                     </div>
//                 </motion.div>
//             </div>
//         </nav>
//     );
// }
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, Calendar, Radio, Bell } from 'lucide-react';

const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Service', href: '/reader', icon: BookOpen },
    { name: 'Events', href: '/schedule', icon: Calendar },
    { name: 'Live', href: '/live', icon: Radio },
    { name: 'Updates', href: '/notifications', icon: Bell },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky align-center justify-center items-center flex p-5 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Logo/Title Section */}
                    <div className="flex items-center justify-between py-4">
                        {/* <Link href="/" className="group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-100 to-violet-200 
                                    flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                    <span className="text-xl">⛪</span>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-lg font-serif font-semibold text-slate-900 tracking-tight">
                                        CSI Church
                                    </h1>
                                    <p className="text-xs text-slate-500 font-light">
                                        Church of South India
                                    </p>
                                </div>
                            </div>
                        </Link> */}

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link key={item.name} href={item.href}>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="relative"
                                        >
                                            <div
                                                className={`
                                                    px-4 py-2.5 rounded-xl transition-all duration-300
                                                    flex items-center gap-2 group
                                                    ${isActive
                                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                    }
                                                `}
                                            >
                                                <Icon className={`w-4 h-4 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`}
                                                    strokeWidth={isActive ? 2 : 1.5} />
                                                <span className="text-sm font-medium">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden pb-3">
                        <div className="flex items-center justify-around gap-1 bg-slate-50/80 rounded-2xl p-1.5 
                            border border-slate-200/60">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link key={item.name} href={item.href} className="flex-1">
                                        <motion.div
                                            whileTap={{ scale: 0.95 }}
                                            className="relative"
                                        >
                                            <div
                                                className={`
                                                    relative px-3 py-2.5 rounded-xl transition-all duration-300
                                                    flex flex-col items-center gap-1
                                                    ${isActive
                                                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                                                        : 'text-slate-600'
                                                    }
                                                `}
                                            >
                                                <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                                                <span className="text-[10px] font-medium">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </nav>
    );
}