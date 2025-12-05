'use client';

import { useState } from 'react';
import { WeeklySchedule, DayPlan } from '@prisma/client';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ScheduleWithDays = WeeklySchedule & {
    days: DayPlan[];
};

type ScheduleViewProps = {
    thisWeek: ScheduleWithDays | null;
    nextWeek: ScheduleWithDays | null;
    lastWeek: ScheduleWithDays | null;
};

export default function ScheduleView({ thisWeek, nextWeek, lastWeek }: ScheduleViewProps) {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="this" className="w-full">
                <TabsList className="bg-slate-200 rounded-2xl p-1 shadow-lg grid w-full grid-cols-3">
                    <TabsTrigger value="last" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                        Last Week
                    </TabsTrigger>
                    <TabsTrigger value="this" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                        This Week
                    </TabsTrigger>
                    <TabsTrigger value="next" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                        Next Week
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="this" className="space-y-4 mt-6">
                    {thisWeek ? <WeekContent schedule={thisWeek} /> : <EmptyState />}
                </TabsContent>

                <TabsContent value="next" className="space-y-4 mt-6">
                    {nextWeek ? <WeekContent schedule={nextWeek} /> : <EmptyState />}
                </TabsContent>

                <TabsContent value="last" className="space-y-4 mt-6">
                    {lastWeek ? <WeekContent schedule={lastWeek} /> : <EmptyState />}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function WeekContent({ schedule }: { schedule: ScheduleWithDays }) {
    return (
        <>
            <div className="text-center mb-6">
                <h2 className="text-xl font-playfair text-slate-900">
                    {format(new Date(schedule.weekStart), 'MMM d')} - {format(new Date(schedule.weekEnd), 'MMM d, yyyy')}
                </h2>
                <p className="text-slate-800 text-sm mt-1">{schedule.label}</p>
            </div>

            <div className="grid gap-4">
                {schedule.days
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((day) => (
                        <Card key={day.id} className="bg-slate-200 border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    <div className="md:w-32 shrink-0">
                                        <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm">
                                            {format(new Date(day.date), 'EEEE')}
                                        </p>
                                        <p className="text-slate-600 text-sm">
                                            {format(new Date(day.date), 'MMM d')}
                                        </p>
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-slate-800">{day.title}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {day.bibleVerses && (
                                    <div className="text-sm">
                                        <span className="text-slate-600 block text-xs uppercase tracking-wide mb-1">Readings</span>
                                        <p className="text-slate-800">{day.bibleVerses}</p>
                                    </div>
                                )}

                                {day.hymns && (
                                    <div className="text-sm">
                                        <span className="text-slate-600 block text-xs uppercase tracking-wide mb-1">Hymns</span>
                                        <p className="text-slate-800">{day.hymns}</p>
                                    </div>
                                )}

                                {day.activities && (
                                    <div className="text-sm bg-white p-3 rounded-lg mt-2">
                                        <span className="text-slate-600 block text-xs uppercase tracking-wide mb-1">Activities</span>
                                        <p className="text-slate-800 whitespace-pre-wrap">{day.activities}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </>
    );
}

function EmptyState() {
    return (
        <Card className="bg-slate-200 border-none">
            <CardContent className="text-center py-12">
                <p className="text-slate-600">No schedule available for this week.</p>
            </CardContent>
        </Card>
    );
}
