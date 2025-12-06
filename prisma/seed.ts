import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // ============================================
    // CREATE CHURCHES
    // ============================================

    console.log('📍 Creating churches...');

    const stMarys = await prisma.church.upsert({
        where: { slug: 'st-marys-church' },
        update: {},
        create: {
            name: "St. Mary's Church",
            slug: 'st-marys-church',
            address: '123 Church Street, City, State 12345',
        },
    });

    const graceCommunity = await prisma.church.upsert({
        where: { slug: 'grace-community' },
        update: {},
        create: {
            name: 'Grace Community Church',
            slug: 'grace-community',
            address: '456 Grace Avenue, Town, State 67890',
        },
    });

    console.log(`✅ Created churches: ${stMarys.name}, ${graceCommunity.name}`);

    // ============================================
    // CREATE USERS
    // ============================================

    console.log('👤 Creating users...');

    // Hash passwords
    const password = await bcrypt.hash('password123', 10);

    // SUPERADMIN (no church)
    const superadmin = await prisma.user.upsert({
        where: { email: 'superadmin@example.com' },
        update: {},
        create: {
            email: 'superadmin@example.com',
            passwordHash: password,
            name: 'Super Administrator',
            role: 'SUPERADMIN',
            churchId: null,
        },
    });

    console.log(`✅ Created SUPERADMIN: ${superadmin.email}`);

    // St. Mary's Church Admin
    const stMarysAdmin = await prisma.user.upsert({
        where: { email: 'admin@stmarys.com' },
        update: {},
        create: {
            email: 'admin@stmarys.com',
            passwordHash: password,
            name: "St. Mary's Admin",
            role: 'CHURCH_ADMIN',
            churchId: stMarys.id,
        },
    });

    console.log(`✅ Created CHURCH_ADMIN for St. Mary's: ${stMarysAdmin.email}`);

    // Grace Community Church Admin
    const graceAdmin = await prisma.user.upsert({
        where: { email: 'admin@grace.com' },
        update: {},
        create: {
            email: 'admin@grace.com',
            passwordHash: password,
            name: 'Grace Admin',
            role: 'CHURCH_ADMIN',
            churchId: graceCommunity.id,
        },
    });

    console.log(`✅ Created CHURCH_ADMIN for Grace Community: ${graceAdmin.email}`);

    // Regular users
    const user1 = await prisma.user.upsert({
        where: { email: 'user1@stmarys.com' },
        update: {},
        create: {
            email: 'user1@stmarys.com',
            passwordHash: password,
            name: 'John Smith',
            role: 'USER',
            churchId: stMarys.id,
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'user2@grace.com' },
        update: {},
        create: {
            email: 'user2@grace.com',
            passwordHash: password,
            name: 'Jane Doe',
            role: 'USER',
            churchId: graceCommunity.id,
        },
    });

    console.log(`✅ Created regular users: ${user1.email}, ${user2.email}`);

    // ============================================
    // CREATE SAMPLE CONTENT FOR ST. MARY'S
    // ============================================

    console.log('📚 Creating sample content for St. Mary\'s...');

    await prisma.bookSection.create({
        data: {
            churchId: stMarys.id,
            language: 'en',
            title: 'Welcome Message',
            body: '<p>Welcome to St. Mary\'s Church digital worship guide.</p>',
            order: 0,
        },
    });

    await prisma.notification.create({
        data: {
            churchId: stMarys.id,
            title: 'Sunday Service',
            message: 'Join us for Sunday worship at 10:00 AM',
            type: 'event',
        },
    });

    console.log('✅ Created sample content');

    // ============================================
    // SUMMARY
    // ============================================

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Login Credentials (all passwords: password123):');
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│ SUPERADMIN:                                                 │');
    console.log('│   Email: superadmin@example.com                             │');
    console.log('│   Access: All churches                                      │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│ St. Mary\'s Admin:                                           │');
    console.log('│   Email: admin@stmarys.com                                  │');
    console.log('│   Access: St. Mary\'s Church only                            │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│ Grace Community Admin:                                      │');
    console.log('│   Email: admin@grace.com                                    │');
    console.log('│   Access: Grace Community Church only                       │');
    console.log('└─────────────────────────────────────────────────────────────┘');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
