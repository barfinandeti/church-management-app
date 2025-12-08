'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Download,
    ChevronRight,
    ChevronLeft,
    X,
    Share,
    PlusSquare,
    Menu,
    BookOpen,
    Calendar,
    Radio,
    Bell,
    CheckCircle2
} from 'lucide-react';

export default function AppGuide() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const hasSeenGuide = localStorage.getItem('hasSeenAppGuide');
        if (!hasSeenGuide) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenAppGuide', 'true');
        setTimeout(() => setStep(0), 300); // Reset step after animation
    };

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleClose();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    if (!mounted) return null;

    const steps = [
        {
            title: "Welcome to Church App",
            content: (
                <div className="text-center space-y-4 py-4">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 mb-6">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                        Your complete companion for worship services, events, and church updates.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                            <span className="block font-semibold text-slate-900 dark:text-white">Offline Ready</span>
                            <span className="text-slate-500 text-xs">Works without internet</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                            <span className="block font-semibold text-slate-900 dark:text-white">Real-time</span>
                            <span className="text-slate-500 text-xs">Live updates & stream</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Install on iOS",
            content: (
                <div className="space-y-4 py-2">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <h3 className="font-semibold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                            Safari Browser
                        </h3>
                        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex items-start gap-3">
                                <span className="bg-slate-200 dark:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">1</span>
                                <span>Tap the <strong>Share</strong> button <Share className="w-4 h-4 inline mx-1" /> in the toolbar.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-slate-200 dark:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">2</span>
                                <span>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-4 h-4 inline mx-1" />.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-slate-200 dark:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">3</span>
                                <span>Tap <strong>Add</strong> to finish.</span>
                            </li>
                        </ol>
                    </div>
                </div>
            )
        },
        {
            title: "Install on Android",
            content: (
                <div className="space-y-4 py-2">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <h3 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                            Chrome Browser
                        </h3>
                        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex items-start gap-3">
                                <span className="bg-slate-200 dark:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">1</span>
                                <span>Tap <strong>Install App</strong> button on the dashboard if visible.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-slate-200 dark:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">2</span>
                                <span>Or tap the menu <Menu className="w-4 h-4 inline mx-1" /> (three dots).</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-slate-200 dark:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">3</span>
                                <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                            </li>
                        </ol>
                    </div>
                </div>
            )
        },
        {
            title: "Quick Features Tour",
            content: (
                <div className="grid grid-cols-1 gap-3 py-2">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">Reader</h4>
                            <p className="text-xs text-amber-800 dark:text-amber-200/80">Follow service order & hymns</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Schedule</h4>
                            <p className="text-xs text-blue-800 dark:text-blue-200/80">Upcoming events & leaders</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
                        <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg text-rose-600 dark:text-rose-400">
                            <Radio className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-rose-900 dark:text-rose-100 text-sm">Live Stream</h4>
                            <p className="text-xs text-rose-800 dark:text-rose-200/80">Watch services live</p>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <>
            {/* Manual Trigger Button */}
            <Button
                variant="ghost"
                onClick={() => { setIsOpen(true); setStep(0); }}
                className="w-full flex items-center justify-between p-4 h-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-sm mb-4"
            >
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
                        <Download className="w-4 h-4" />
                    </span>
                    App Guide & Installation
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
            </Button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
                            <div
                                className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                            />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6 pt-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-playfair">
                                {steps[step].title}
                            </h2>

                            <div className="min-h-[300px] flex flex-col justify-center">
                                {steps[step].content}
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Button
                                    variant="ghost"
                                    onClick={handleClose}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400"
                                >
                                    Skip
                                </Button>

                                <div className="flex gap-2">
                                    {step > 0 && (
                                        <Button
                                            variant="outline"
                                            onClick={handleBack}
                                            className="border-slate-200 dark:border-slate-700"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Back
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleNext}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
                                    >
                                        {step === steps.length - 1 ? (
                                            <>
                                                Get Started
                                                <CheckCircle2 className="w-4 h-4 ml-2" />
                                            </>
                                        ) : (
                                            <>
                                                Next
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
