
import { prisma } from '../src/utils/prisma.js';

async function main() {
    console.log("🔍 Buscando registros mistos (Função + Cor Importada)...");

    // Vamos buscar registros que tenham texto mas NÃO sejam só "cor ano ..."
    // E que tenham sido tocados pela migração (opcional, mas bom pra ver o resultado da concatenação)

    const trabalhadores = await prisma.inscricaoTrabalhador.findMany({
        take: 200,
        select: {
            nomeCompleto1: true,
            equipesJaServiram: true
        }
    });

    const mistos = trabalhadores.filter(t => {
        const hist = t.equipesJaServiram || '';
        // Critério solto: tem "ano" (do importado) E tem algum outro texto
        return hist.includes('ano') && hist.length > 20;
    });

    console.log(`Encontrados ${mistos.length} candidatos a mistos:`);
    mistos.slice(0, 10).forEach(t => {
        console.log(`- ${t.nomeCompleto1}: ${t.equipesJaServiram}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
