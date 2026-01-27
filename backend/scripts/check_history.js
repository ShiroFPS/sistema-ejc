
import { prisma } from '../src/utils/prisma.js';

async function main() {
    console.log("🔍 Listando últimos 20 trabalhadores...");

    const trabalhadores = await prisma.inscricaoTrabalhador.findMany({
        take: 20,
        orderBy: { updatedAt: 'desc' }, // Ver os mais recentementes modificados (onde o script deve ter atuado)
        select: {
            id: true,
            nomeCompleto1: true,
            equipesJaServiram: true
        }
    });

    console.log(`\nEncontrados ${trabalhadores.length} registros:`);
    trabalhadores.forEach(t => {
        console.log(`ID: ${t.id} | Nome: ${t.nomeCompleto1} | Histórico: [${t.equipesJaServiram}]`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
