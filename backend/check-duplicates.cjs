
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const cpf = "08777221451";
        const nome = "jonathas paulo dos santos catao";
        const cpfTest = "00000000000";

        const p1 = await prisma.inscricaoParticipante.findFirst({ where: { OR: [{ cpf }, { nomeCompleto: nome }, { cpf: cpfTest }] } });
        console.log('PARTICIPANTE_FOUND:', JSON.stringify(p1, null, 2));

        const t1 = await prisma.inscricaoTrabalhador.findFirst({ where: { OR: [{ cpf1: cpf }, { nomeCompleto1: nome }, { cpf1: cpfTest }] } });
        console.log('TRABALHADOR_FOUND:', JSON.stringify(t1, null, 2));

    } catch (err) {
        console.error('FAIL:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
