import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDb() {
    try {
        const count = await prisma.pulseLog.count();
        const latest = await prisma.pulseLog.findMany({
            take: 5,
            orderBy: { timestamp: 'desc' }
        });
        console.log(`✅ DB Check: Total PulseLogs: ${count}`);
        console.log('Latest records:', latest);
    } catch (e) {
        console.error('❌ DB Check Failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkDb();
