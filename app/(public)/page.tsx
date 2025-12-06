import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar, Heart } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <h1 className="text-5xl md:text-7xl font-playfair font-bold tracking-tight">
                        Welcome to Our Community
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light">
                        Connecting churches, empowering members, and sharing the word of God.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <Link href="/login">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-full">
                                Member Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full">
                                Join Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Common Content Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">Weekly Inspiration</h2>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">Discover stories, news, and updates from the global community.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Bible Story Card */}
                        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Bible Story of the Week</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                "The Good Samaritan" - A lesson on compassion and loving your neighbor as yourself. Luke 10:25-37.
                            </p>
                            <Button variant="link" className="text-indigo-600 dark:text-indigo-400 p-0">Read More &rarr;</Button>
                        </Card>

                        {/* News Card */}
                        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Community News</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Join us for the upcoming Annual Youth Conference next month. Registration is now open for all churches.
                            </p>
                            <Button variant="link" className="text-indigo-600 dark:text-indigo-400 p-0">View Details &rarr;</Button>
                        </Card>

                        {/* Daily Verse Card */}
                        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center mb-6 text-rose-600 dark:text-rose-400">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Verse of the Day</h3>
                            <blockquote className="text-slate-600 dark:text-slate-400 mb-4 italic border-l-4 border-rose-200 dark:border-rose-900 pl-4">
                                "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."
                            </blockquote>
                            <p className="text-sm text-slate-500">- Jeremiah 29:11</p>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}