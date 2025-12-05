import { PrismaClient } from '@prisma/client';
import { addDays, startOfWeek, endOfWeek, format } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    // Admin User
    const adminEmail = 'admin@example.com';
    const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
        await prisma.adminUser.create({
            data: {
                email: adminEmail,
                passwordHash: 'password', // In production, hash this!
            },
        });
        console.log('Created admin user');
    }

    // Book Sections
    const sections = [
        {
            title: "The Lord's Prayer",
            language: 'en',
            body: "Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come;\nthy will be done;\non earth as it is in heaven.\nGive us this day our daily bread.\nAnd forgive us our trespasses,\nas we forgive those who trespass against us.\nAnd lead us not into temptation;\nbut deliver us from evil.\nFor thine is the kingdom,\nthe power and the glory,\nfor ever and ever.\nAmen.",
            order: 1,
        },
        {
            title: "ప్రభువు ప్రార్థన",
            language: 'te',
            body: "పరలోకమందున్న మా తండ్రీ,\nనీ నామము పరిశుద్ధపరచబడు గాక;\nనీ రాజ్యము వచ్చుగాక;\nనీ చిత్తము పరలోకమందు నెరవేరునట్లు భూమియందును నెరవేరుగాక.\nమా అనుదిన ఆహారము నేడు మాకు దయచేయుము.\nమా ఋణస్తులను మేము క్షమించియున్న ప్రకారము మా ఋణములను క్షమించుము.\nమమ్మును శోధనలోనికి తేక దుష్టుని నుండి మమ్మును తప్పించుము.\nరాజ్యము, బలము, మహిమ నిరంతరము నీవియై యున్నవి.\nఆమెన్.",
            order: 1,
        },
        {
            title: "Psalm 23",
            language: 'en',
            body: "The Lord is my shepherd; I shall not want.\nHe maketh me to lie down in green pastures: he leadeth me beside the still waters.\nHe restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.\nYea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.\nThou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.\nSurely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever.",
            order: 2,
        },
    ];

    for (const s of sections) {
        const exists = await prisma.bookSection.findFirst({ where: { title: s.title, language: s.language } });
        if (!exists) {
            await prisma.bookSection.create({ data: s });
            console.log(`Created section: ${s.title}`);
        }
    }

    // Live Stream Config
    const config = await prisma.liveStreamConfig.findFirst();
    if (!config) {
        await prisma.liveStreamConfig.create({
            data: {
                youtubeVideoId: 'dQw4w9WgXcQ', // Placeholder
                isLive: false,
                title: 'Sunday Service',
            },
        });
        console.log('Created live stream config');
    }

    // Weekly Schedule (Current Week)
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });

    const existingWeek = await prisma.weeklySchedule.findFirst({
        where: { weekStart: start },
    });

    if (!existingWeek) {
        const week = await prisma.weeklySchedule.create({
            data: {
                weekStart: start,
                weekEnd: end,
                label: 'This Week',
            },
        });

        for (let i = 0; i < 7; i++) {
            const dayDate = addDays(start, i);
            await prisma.dayPlan.create({
                data: {
                    weekId: week.id,
                    date: dayDate,
                    title: format(dayDate, 'EEEE'),
                    bibleVerses: i === 6 ? 'Psalm 100, John 3:16' : '', // Sunday
                    hymns: i === 6 ? 'Hymn 10, Hymn 25' : '',
                    activities: i === 2 ? 'Bible Study @ 6PM' : '', // Wednesday
                },
            });
        }
        console.log('Created current weekly schedule');
    }

    // Notification
    const note = await prisma.notification.findFirst();
    if (!note) {
        await prisma.notification.create({
            data: {
                title: 'Welcome to the App',
                message: 'We are glad to have you here. Check out the Reader and Schedule sections.',
                type: 'info',
            },
        });
        console.log('Created initial notification');
    }

    // Worship Service (Today)
    // Create a dummy service for today if not exists
    const service = await prisma.worshipService.findFirst();
    if (!service) {
        await prisma.worshipService.create({
            data: {
                date: today,
                title: "Sunday Worship Service",
                orderOfWorship: JSON.stringify(["Call to Worship", "Hymn 1", "Prayer", "Scripture Reading", "Sermon", "Benediction"]),
                mainBibleVerses: "John 3:16",
                hymnNumbers: "1, 23, 45",
                summary: "A blessed time of worship."
            }
        });
        console.log('Created worship service for today');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
