import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Resetando status de todas as inscrições para PENDENTE...');

    const resP = await prisma.inscricaoParticipante.updateMany({
        data: { status: 'PENDENTE' }
    });

    const resT = await prisma.inscricaoTrabalhador.updateMany({
        data: { status: 'PENDENTE' }
    });

    console.log(`✅ Sucesso!`);
    console.log(`📊 Participantes resetados: ${resP.count}`);
    console.log(`📊 Trabalhadores resetados: ${resT.count}`);
}

main()
    .catch((e) => {
        console.error('❌ Erro:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
