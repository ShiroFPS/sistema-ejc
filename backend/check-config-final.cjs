
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const config = await prisma.configuracao.findUnique({ where: { id: 1 } });
        console.log('CONFIG:', JSON.stringify(config, null, 2));

        const count = await prisma.inscricaoParticipante.count();
        console.log('PARTICIPANT_COUNT:', count);

        const countT = await prisma.inscricaoTrabalhador.count();
        console.log('WORKER_COUNT:', countT);

    } catch (err) {
        console.error('FAIL:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
