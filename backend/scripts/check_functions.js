
import { prisma } from '../src/utils/prisma.js';

async function main() {
    console.log("🔍 Buscando registros APENAS com funções (sem importação de cor):");

    const trabalhadores = await prisma.inscricaoTrabalhador.findMany({
        where: {
            equipesJaServiram: {
                not: '',
                // not: { contains: 'ano' } // Prisma sqlite limitation often, let's filter in JS
            }
        },
        take: 200,
        select: {
            nomeCompleto1: true,
            equipesJaServiram: true
        }
    });

    // Filtra no JS quem NÃO tem "ano" (ou seja, não veiodo importado)
    const funcoesPuras = trabalhadores.filter(t => !t.equipesJaServiram.toLowerCase().includes('ano '));

    console.log(`Encontrados ${funcoesPuras.length} com funções manuais:`);
    funcoesPuras.slice(0, 10).forEach(t => {
        console.log(`- ${t.nomeCompleto1}: ${t.equipesJaServiram}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
