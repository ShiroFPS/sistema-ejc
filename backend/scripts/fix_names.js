
import { prisma } from '../src/utils/prisma.js';

async function main() {
    console.log("🧹 Iniciando limpeza de nomes e metadados...");

    // 1. Remover registro específico (sujeira)
    const idRemover = 'c1e59a7a-1a89-4434-81df-3feec57d12c4';
    try {
        await prisma.inscricaoTrabalhador.delete({ where: { id: idRemover } });
        console.log(`✅ Registro ${idRemover} removido com sucesso.`);
    } catch (e) {
        console.log(`⚠️ Registro ${idRemover} não encontrado ou já removido.`);
    }

    // 2. Limpar nomes e mover metadados
    const trabalhadores = await prisma.inscricaoTrabalhador.findMany();
    const regexParenteses = /\((.*?)\)/; // Captura tudo entre parenteses

    let count = 0;

    for (const t of trabalhadores) {
        let updates = {};
        let historicoExtra = [];

        // Processar Nome 1
        if (t.nomeCompleto1) {
            const match = t.nomeCompleto1.match(regexParenteses);
            if (match) {
                const conteudo = match[1]; // Ex: "azul ano XXVIII"
                updates.nomeCompleto1 = t.nomeCompleto1.replace(regexParenteses, '').trim();
                historicoExtra.push(`Pessoa 1: ${conteudo}`);
            }
        }

        // Processar Nome 2 (se houver)
        if (t.nomeCompleto2) {
            const match = t.nomeCompleto2.match(regexParenteses);
            if (match) {
                const conteudo = match[1];
                updates.nomeCompleto2 = t.nomeCompleto2.replace(regexParenteses, '').trim();
                historicoExtra.push(`Pessoa 2: ${conteudo}`);
            }
        }

        // Se encontrou algo para mover
        if (historicoExtra.length > 0) {
            const historicoAtual = t.equipesJaServiram || '';
            const novoHistorico = historicoAtual
                ? `${historicoAtual}. [Histórico Importado: ${historicoExtra.join(', ')}]`
                : `[Histórico Importado: ${historicoExtra.join(', ')}]`;

            updates.equipesJaServiram = novoHistorico;

            await prisma.inscricaoTrabalhador.update({
                where: { id: t.id },
                data: updates
            });
            count++;
            console.log(`🔄 Atualizado: ${t.nomeCompleto1} -> Metadados movidos para Equipes.`);
        }
    }

    console.log(`\n✨ Concluído! ${count} registros foram corrigidos e migrados.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
