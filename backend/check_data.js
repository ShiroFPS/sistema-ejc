import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Participants ---');
    const participants = await prisma.inscricaoParticipante.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    });

    participants.forEach(p => {
        console.log(`ID: ${p.id} | Nome: ${p.nomeCompleto} | FotoURL: ${p.fotoUrl ? 'EXISTS' : 'MISSING'} | URL: ${p.fotoUrl}`);
    });

    const total = await prisma.inscricaoParticipante.count();
    const withFoto = await prisma.inscricaoParticipante.count({
        where: { fotoUrl: { not: null, not: '' } }
    });

    console.log(`\nTotal Participants: ${total}`);
    console.log(`Participants with Foto: ${withFoto}`);

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
