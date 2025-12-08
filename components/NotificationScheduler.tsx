'use client'

import { useState } from 'react'
import { CircleCheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface NotificationSchedulerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    time: string;
    setTime: (time: string) => void;
    title?: string;
}

export default function NotificationScheduler({ date, setDate, time, setTime, title = "Schedule Notification" }: NotificationSchedulerProps) {
    // Generate time slots from 00:00 to 23:45
    const timeSlots = Array.from({ length: 96 }, (_, i) => {
        const totalMinutes = i * 15
        const hour = Math.floor(totalMinutes / 60)
        const minute = totalMinutes % 60
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    })

    return (
        <Card className='gap-0 p-0 border-slate-800 bg-slate-900/50'>
            <CardHeader className='flex h-max justify-center border-b border-slate-800 !p-4'>
                <CardTitle className="text-slate-200 text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className='relative p-0 md:pr-48'>
                <div className='p-6 flex justify-center'>
                    <Calendar
                        mode='single'
                        selected={date}
                        onSelect={setDate}
                        defaultMonth={date || new Date()}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        showOutsideDays={false}
                        className='bg-transparent p-0'
                        classNames={{
                            day_selected: "bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white",
                            day_today: "bg-slate-800 text-slate-100",
                        }}
                    />
                </div>
                <div className='inset-y-0 right-0 flex w-full flex-col gap-4 border-t border-slate-800 max-md:h-60 md:absolute md:w-48 md:border-t-0 md:border-l'>
                    <ScrollArea className='h-full'>
                        <div className='flex flex-col gap-2 p-6'>
                            {timeSlots.map(slot => (
                                <Button
                                    key={slot}
                                    variant={time === slot ? 'default' : 'outline'}
                                    onClick={() => setTime(slot)}
                                    className={`w-full shadow-none ${time === slot
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent'
                                        : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                    type="button" // Prevent form submission
                                >
                                    {slot}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-4 border-t border-slate-800 px-6 !py-5 md:flex-row'>
                <div className='flex items-center gap-2 text-sm text-slate-400'>
                    {date && time ? (
                        <>
                            <CircleCheckIcon className='size-5 stroke-green-500' />
                            <span>
                                Scheduled for{' '}
                                <span className='font-medium text-slate-200'>
                                    {date.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long'
                                    })}
                                </span>{' '}
                                at <span className='font-medium text-slate-200'>{time}</span>
                            </span>
                        </>
                    ) : (
                        <span>Select a date and time to schedule.</span>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}
