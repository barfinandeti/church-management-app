import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Radio, Bell, ChevronRight } from 'lucide-react';

async function getTodayService() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const service = await prisma.worshipService.findFirst({
        where: {
            date: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    return service;
}

async function getRecentNotifications() {
    return await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
    });
}

export default async function HomePage() {
    const service = await getTodayService();
    const notifications = await getRecentNotifications();

    const quickActions = [
        {
            title: "Order of Service",
            description: "Today's worship guide",
            icon: BookOpen,
            href: "/reader",
            gradient: "from-amber-50/50 to-amber-100/50",
            iconColor: "text-amber-700",
            hoverShadow: "hover:shadow-amber-200/20",
        },
        {
            title: "Events",
            description: "Weekly schedule",
            icon: Calendar,
            href: "/schedule",
            gradient: "from-blue-50/50 to-blue-100/50",
            iconColor: "text-blue-700",
            hoverShadow: "hover:shadow-blue-200/20",
        },
        {
            title: "Live Stream",
            description: "Watch services",
            icon: Radio,
            href: "/live",
            gradient: "from-rose-50/50 to-rose-100/50",
            iconColor: "text-rose-700",
            hoverShadow: "hover:shadow-rose-200/20",
        },
    ];

    return (
        <div className="min-h-[80vh] flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full space-y-16">

                {/* Welcome Section */}
                <div className="text-center space-y-6 animate-float">
                    <h1 className="text-5xl sm:text-7xl font-serif font-light text-foreground tracking-tight">
                        Welcome Home
                    </h1>
                    <p className="text-muted-foreground text-xl font-light max-w-2xl mx-auto">
                        {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {quickActions.map((action, i) => {
                        const Icon = action.icon;
                        return (
                            <Link key={i} href={action.href} className="group">
                                {/* <Card className={`relative overflow-hidden border-white/20 dark:border-white/10 glass
                                    transition-all duration-500 hover:-translate-y-2 hover:scale-101 hover:shadow-2xl ${action.hoverShadow}`}> */}
                                <Card
                                    className={`
                                                relative overflow-hidden 
                                                border-white/20 dark:border-white/10 
                                                transition-all duration-500 hover:-translate-y-2 hover:scale-101 hover:shadow-2xl 
                                                bg-[#F7F7F5] dark:bg-[#0F172B] dark:text-white  hover:bg-[#14213a]/80 dark:hover:bg-[#000c54]
                                                transition-all duration-300
                                                ${action.hoverShadow}
                                            `}>

                                    <div className="p-8 space-y-6">
                                        <div className={`w-16 h-16 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur-md flex items-center justify-center 
                                            ${action.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                            <Icon className="w-8 h-8" strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-serif text-foreground tracking-tight dark:text-white">
                                                {action.title}
                                            </h3>
                                            <p className="text-muted-foreground font-light dark:text-white">
                                                {action.description}
                                            </p>
                                        </div>
                                        <div className="absolute bottom-8 right-8 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <ChevronRight className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Notifications Section */}
                <div className="max-w-3xl mx-auto w-full">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="h-px w-12 bg-border"></div>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Latest Updates</span>
                        <div className="h-px w-12 bg-border"></div>
                    </div>

                    <div className="space-y-6">
                        {notifications.length > 0 ? (
                            <>
                                {notifications.map((note: any) => (
                                    // <Card key={note.id} className="glass border-white/20 dark:border-white/10
                                    //     hover:bg-white/60 dark:hover:bg-black/60 transition-all duration-300">
                                    <Card
                                        key={note.id}
                                        className="
                                            border-white/20 dark:border-white/10 
                                            bg-[#F7F7F5] dark:bg-[#0F172B]  
                                            hover:bg-[#14213a]/80 dark:hover:bg-[#000c54]
                                            transition-all duration-300
                                        "
                                    >

                                        <div className="p-6 sm:p-8 flex gap-6">
                                            <div className="shrink-0">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Bell className="w-5 h-5 text-primary dark:text-white" strokeWidth={1.5} />
                                                </div>
                                            </div>
                                            <div className="space-y-2 flex-1 ">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-lg font-medium text-foreground dark:text-white">
                                                        {note.title}
                                                    </h3>
                                                    <time className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 
                                                        rounded-full whitespace-nowrap dark:text-white">
                                                        {format(new Date(note.createdAt), 'MMM d')}
                                                    </time>
                                                </div>
                                                <div
                                                    className="text-muted-foreground leading-relaxed font-light prose prose-sm dark:prose-invert max-w-none dark:text-white"
                                                    dangerouslySetInnerHTML={{ __html: note.message }}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                <div className="pt-8 text-center">
                                    <Link href="/notifications">
                                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                                            View All Updates
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground font-light">
                                    No updates at this time
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}