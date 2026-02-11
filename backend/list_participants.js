import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function list() {
    const participants = await prisma.inscricaoParticipante.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' }
    });

    participants.forEach(p => {
        console.log(`[${p.createdAt.toISOString()}] ${p.nomeCompleto}`);
    });

    await prisma.$disconnect();
}

list();
