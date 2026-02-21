
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkConfig() {
    try {
        const config = await prisma.configuracao.findUnique({ where: { id: 1 } });
        console.log('Current Config:', JSON.stringify(config, null, 2));

        const countP = await prisma.inscricaoParticipante.count();
        const countT = await prisma.inscricaoTrabalhador.count();
        console.log('Counts - P:', countP, 'T:', countT);

        if (config.dataLimiteInscricoes) {
            const now = new Date();
            const limit = new Date(config.dataLimiteInscricoes);
            console.log('Now:', now.toISOString());
            console.log('Limit:', limit.toISOString());
            console.log('Expired:', now > limit);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkConfig();
