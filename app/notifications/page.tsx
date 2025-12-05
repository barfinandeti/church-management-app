import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
    });

    return (
        <div className="space-y-8">
            <header className="text-center">
                <h1 className="text-3xl font-bold font-playfair text-slate-800">
                    Verse of the Day & Updates
                </h1>
                <p className="text-slate-400 mt-2">Latest announcements</p>
            </header>

            <div className="grid gap-4">
                {notifications.length > 0 ? (
                    notifications.map((note) => (
                        <Card key={note.id} className="bg-slate-200 border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge
                                        variant={
                                            note.type === 'event' ? 'default' :
                                                note.type === 'reminder' ? 'secondary' :
                                                    'outline'
                                        }
                                        className="uppercase"
                                    >
                                        {note.type}
                                    </Badge>
                                    <span className="text-xs text-slate-600">
                                        {format(new Date(note.createdAt), 'MMM d, h:mm a')}
                                    </span>
                                </div>
                                <CardTitle className="text-slate-900">{note.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="text-slate-700 leading-relaxed prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: note.message }}
                                />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="bg-slate-200 border-none">
                        <CardContent className="text-center py-12">
                            <p className="text-slate-600">No notifications at this time.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
