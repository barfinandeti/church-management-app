'use client';

import { createWeeklySchedule } from '@/app/actions/schedule';
import ChurchSelector from '@/components/ChurchSelector';
import { useTransition, useState } from 'react';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface CreateWeekFormProps {
    churches: { id: string; name: string }[];
}

export default function CreateWeekForm({ churches }: CreateWeekFormProps) {
    const [isPending, startTransition] = useTransition();
    const [date, setDate] = useState<Date>();

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await createWeeklySchedule(formData);
            if (result && !result.success) {
                toast.error(result.error || 'Failed to create week');
            }
            // If successful, it redirects, so no need to toast success here usually
        });
    };

    return (
        <form action={handleSubmit} className="flex flex-col gap-4">
            {churches.length > 0 && (
                <ChurchSelector churches={churches} className="w-full md:w-1/2" />
            )}
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-400 mb-1">Week Start Date (Monday)</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className={`w-full justify-start text-left font-normal bg-slate-800 border-slate-700 hover:bg-slate-750 hover:text-slate-200 ${!date && "text-slate-500"
                                    }`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                initialFocus
                                className="rounded-md"
                            />
                        </PopoverContent>
                    </Popover>
                    {/* Hidden input to send date to server */}
                    {date && (
                        <input
                            type="hidden"
                            name="weekStart"
                            value={format(date, 'yyyy-MM-dd')}
                        />
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isPending || !date}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {isPending ? 'Processing...' : 'Create / Open Week'}
                </button>
            </div>
        </form>
    );
}
