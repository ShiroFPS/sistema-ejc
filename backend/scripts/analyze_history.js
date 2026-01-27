
import { prisma } from '../src/utils/prisma.js';

async function main() {
    console.log("🔍 Analisando padrões no histórico...");

    const trabalhadores = await prisma.inscricaoTrabalhador.findMany({
        where: {
            equipesJaServiram: {
                not: ''
            }
        },
        select: {
            equipesJaServiram: true
        }
    });

    console.log(`Analisando ${trabalhadores.length} registros...`);

    // Vamos ver se algum foge do padrão "cor ano"
    // Padrão comum: cor (ex: azul, verde) + "ano" + algarismo romano
    const samples = trabalhadores.slice(0, 15);
    samples.forEach(t => console.log(`- ${t.equipesJaServiram}`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
