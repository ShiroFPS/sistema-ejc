import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const c = await prisma.inscricaoParticipante.count();
    console.log('Total Participantes:', c);
}
main().finally(() => prisma.$disconnect());
