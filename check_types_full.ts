
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
    const churchFilter: { churchId: string } | {} = {};

    const englishSections = await prisma.bookSection.findMany({
        where: {
            language: 'en',
            ...churchFilter
        },
        include: {
            church: true
        },
        orderBy: { order: 'asc' },
    });
}
