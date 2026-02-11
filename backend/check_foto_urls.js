import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    const participants = await prisma.inscricaoParticipante.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    });

    participants.forEach(p => {
        console.log(`Name: ${p.nomeCompleto} | FotoURL: ${p.fotoUrl}`);
    });

    await prisma.$disconnect();
}

check();
