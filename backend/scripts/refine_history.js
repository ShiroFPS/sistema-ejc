
import { prisma } from '../src/utils/prisma.js';

async function main() {
    console.log("🧹 Refinando conteúdo do histórico...");

    const trabalhadores = await prisma.inscricaoTrabalhador.findMany({
        where: {
            equipesJaServiram: {
                contains: 'Histórico Importado'
            }
        }
    });

    console.log(`Encontrados ${trabalhadores.length} registros para ajustar.`);
    let count = 0;

    for (const t of trabalhadores) {
        let history = t.equipesJaServiram;

        // Remove prefixos
        history = history.replace(/\[Histórico Importado: Pessoa \d: /g, '');
        history = history.replace(/\[Histórico Importado: /g, '');

        // Remove sufixos
        history = history.replace(/\]/g, '');

        if (history !== t.equipesJaServiram) {
            await prisma.inscricaoTrabalhador.update({
                where: { id: t.id },
                data: { equipesJaServiram: history.trim() }
            });
            count++;
        }
    }

    console.log(`✨ Concluído! ${count} registros refinados.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
