
import { prisma } from '../src/utils/prisma.js';

async function main() {
    console.log("🔍 Buscando usuário 'Importado da Substituição'...");

    const user = await prisma.inscricaoTrabalhador.findFirst({
        where: {
            paroquiaEjcAno: {
                contains: 'Importado da Substitui'
            }
        }
    });

    if (user) {
        console.log(`\nEncontrado:`);
        console.log(`ID: ${user.id}`);
        console.log(`Nome: ${user.nomeCompleto1}`);
        console.log(`Paróquia/Ano: ${user.paroquiaEjcAno}`);
        console.log(`Histórico (DB): '${user.equipesJaServiram}'`);
    } else {
        console.log("❌ Nenhum usuário encontrado com esse dado em 'paroquiaEjcAno'.");

        // Vamos listar alguns para ver se achamos pelo contexto
        const all = await prisma.inscricaoTrabalhador.findMany({ take: 5 });
        console.log("\n5 Primeiros registros para comparação:");
        all.forEach(u => console.log(`- ${u.nomeCompleto1} (${u.paroquiaEjcAno})`));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
