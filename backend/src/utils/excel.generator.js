import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const gerarExcel = async (filtros = {}) => {
    const where = {};
    if (filtros.status) where.status = filtros.status;
    if (filtros.grupoFuncional) where.grupoFuncional = filtros.grupoFuncional;

    let inscricoes = [];

    // Buscar Participantes (se não houver filtro de tipo ou se for PARTICIPANTE)
    if (!filtros.tipo || filtros.tipo === 'PARTICIPANTE') {
        const participantes = await prisma.inscricaoParticipante.findMany({
            where: filtros.status ? { status: filtros.status } : {},
            orderBy: { createdAt: 'desc' },
        });
        inscricoes = [...inscricoes, ...participantes.map(p => ({ ...p, tipo: 'PARTICIPANTE' }))];
    }

    // Buscar Trabalhadores (se não houver filtro de tipo ou se for TRABALHADOR)
    if (!filtros.tipo || filtros.tipo === 'TRABALHADOR') {
        const trabalhadoresWhere = {};
        if (filtros.status) trabalhadoresWhere.status = filtros.status;
        if (filtros.grupoFuncional) trabalhadoresWhere.grupoFuncional = filtros.grupoFuncional;

        const trabalhadores = await prisma.inscricaoTrabalhador.findMany({
            where: trabalhadoresWhere,
            orderBy: { createdAt: 'desc' },
        });
        inscricoes = [...inscricoes, ...trabalhadores.map(t => ({ ...t, tipo: 'TRABALHADOR' }))];
    }

    // Ordem oficial das funções
    const ORDEM_FUNCOES = [
        'Equipe dirigente', 'Coordenação Geral', 'Boa Vontade', 'Banda',
        'Apresentadores', 'Sociodrama', 'Som & Iluminação', 'Liturgia & Vigília',
        'Externa', 'Secretaria', 'Círculos', 'Tráfego, Correios e Compras',
        'Lanchinho', 'Cozinha', 'Minibox', 'Ordem', 'Trânsito & Recepção'
    ];

    // Ordenação combinada: 
    // 1. Ordem da Função (se for trabalhador e tiver função)
    // 2. Data de criação
    inscricoes.sort((a, b) => {
        // Se ambos têm função, ordena pela função
        if (a.funcaoTrabalhador && b.funcaoTrabalhador) {
            const indexA = ORDEM_FUNCOES.indexOf(a.funcaoTrabalhador);
            const indexB = ORDEM_FUNCOES.indexOf(b.funcaoTrabalhador);

            // Se ambos estão na lista, ordena pelo índice
            if (indexA !== -1 && indexB !== -1) {
                if (indexA !== indexB) return indexA - indexB;
            }
        }

        // Se a função for igual ou não tiver função, desempata pela data (mais recente primeiro)
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // 4. Preparar dados normalizados em memória
    const dataRows = inscricoes.map(inscricao => ({
        id: inscricao.id.substring(0, 8),
        tipo: inscricao.tipo,
        status: inscricao.status,
        grupoFuncional: ['VERDE', 'AMARELO', 'VERMELHO'].includes(inscricao.grupoFuncional) ? inscricao.grupoFuncional : '',
        nomeCompleto: inscricao.nomeCompleto1 || inscricao.nomeCompleto,
        apelido: inscricao.apelido,
        dataNascimento: inscricao.dataNascimento ? new Date(inscricao.dataNascimento).toLocaleDateString('pt-BR') : '',
        sexo: inscricao.sexo,
        telefone: inscricao.telefone,
        instagram: inscricao.instagram || '',
        estadoCivil: inscricao.estadoCivil,
        escolaridade: inscricao.escolaridade,
        profissao: inscricao.profissao,
        trabalha: inscricao.trabalha ? 'Sim' : 'Não',
        localTrabalho: inscricao.localTrabalho || '',
        batizado: inscricao.batizado ? 'Sim' : 'Não',
        fezPrimeiraComunhao: inscricao.fezPrimeiraComunhao ? 'Sim' : 'Não',
        fezCrisma: inscricao.fezCrisma ? 'Sim' : 'Não',
        enderecoCompleto: inscricao.enderecoCompleto,
        bairro: inscricao.bairro,
        moraComQuem: inscricao.moraComQuem,
        nomeMae: inscricao.nomeMae,
        telefoneMae: inscricao.telefoneMae,
        nomePai: inscricao.nomePai,
        telefonePai: inscricao.telefonePai,
        amigosParentesInscritos: inscricao.amigosParentesInscritos || '',
        restricoesAlimentares: inscricao.restricoesAlimentares || '',
        alergias: inscricao.alergias || '',
        problemasSaude: inscricao.problemasSaude || '',
        medicamentosContinuos: inscricao.medicamentosContinuos || '',
        createdAt: new Date(inscricao.createdAt).toLocaleString('pt-BR'),
        // Campos auxiliares para lógica (não são colunas diretas se não definidos no header)
        funcaoTrabalhador: inscricao.funcaoTrabalhador
    }));

    // 5. Definir TODAS as colunas possíveis
    const allColumns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Grupo Funcional', key: 'grupoFuncional', width: 20 },
        { header: 'Nome Completo', key: 'nomeCompleto', width: 30 },
        { header: 'Apelido', key: 'apelido', width: 20 },
        { header: 'Data Nascimento', key: 'dataNascimento', width: 15 },
        { header: 'Sexo', key: 'sexo', width: 12 },
        { header: 'Telefone', key: 'telefone', width: 15 },
        { header: 'Instagram', key: 'instagram', width: 20 },
        { header: 'Estado Civil', key: 'estadoCivil', width: 15 },
        { header: 'Escolaridade', key: 'escolaridade', width: 20 },
        { header: 'Profissão', key: 'profissao', width: 20 },
        { header: 'Trabalha', key: 'trabalha', width: 10 },
        { header: 'Local Trabalho', key: 'localTrabalho', width: 25 },
        { header: 'Batizado', key: 'batizado', width: 10 },
        { header: 'Primeira Comunhão', key: 'fezPrimeiraComunhao', width: 18 },
        { header: 'Crisma', key: 'fezCrisma', width: 10 },
        { header: 'Endereço', key: 'enderecoCompleto', width: 40 },
        { header: 'Bairro', key: 'bairro', width: 20 },
        { header: 'Mora Com', key: 'moraComQuem', width: 20 },
        { header: 'Nome Mãe', key: 'nomeMae', width: 30 },
        { header: 'Telefone Mãe', key: 'telefoneMae', width: 15 },
        { header: 'Nome Pai', key: 'nomePai', width: 30 },
        { header: 'Telefone Pai', key: 'telefonePai', width: 15 },
        { header: 'Amigos/Parentes Inscritos', key: 'amigosParentesInscritos', width: 40 },
        { header: 'Restrições Alimentares', key: 'restricoesAlimentares', width: 30 },
        { header: 'Alergias', key: 'alergias', width: 30 },
        { header: 'Problemas de Saúde', key: 'problemasSaude', width: 30 },
        { header: 'Medicamentos', key: 'medicamentosContinuos', width: 30 },
        { header: 'Data Inscrição', key: 'createdAt', width: 18 },
    ];

    // 6. Filtrar colunas que tenham Pelo Menos Um Valor preenchido
    // Verifica se alguma linha tem valor não-vazio para a chave da coluna.
    // 'false', '0' contam como valor. '' ou null/undefined não.
    // Para 'trabalha' (Sim/Não), sempre tem valor, ok.
    const activeColumns = allColumns.filter(col => {
        return dataRows.some(row => {
            const val = row[col.key];
            return val !== null && val !== undefined && val !== '';
        });
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inscrições');

    // Aplicar colunas filtradas
    worksheet.columns = activeColumns;

    // Estilizar header principal
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6366F1' },
    };

    // Função interna para adicionar linha filtrada
    // o método addRow do ExcelJS aceita objeto e mapeia pelas chaves das colunas definidas em worksheet.columns
    // chaves extras no objeto são ignoradas, o que é perfeito.
    const addInscricaoRow = (row) => {
        worksheet.addRow(row);
    };

    if (filtros.agrupado === 'true' && filtros.tipo === 'TRABALHADOR') {
        // MODO AGRUPADO POR FUNÇÃO

        let lastRowNumber = 1;

        // 1. Iterar sobre a ordem oficial das funções
        for (const funcao of ORDEM_FUNCOES) {
            // Filtrar trabalhadores desta função
            const sectionRows = dataRows.filter(r => r.funcaoTrabalhador === funcao);

            if (sectionRows.length > 0) {
                // Adicionar linha de cabeçalho da função (Linha em branco antes se não for a primeira)
                if (worksheet.rowCount > 1) worksheet.addRow([]);

                // Array para linha de título precisa bater nas colunas? Não necessáriamente se usarmos values array.
                // Mas worksheet.addRow com array funciona posicionalmente.
                const sectionRow = worksheet.addRow([funcao.toUpperCase()]);

                // Merge cells para o título ocupar a largura total das colunas ativas
                // A última coluna é activeColumns.length
                // String.fromCharCode(64 + n) funciona até Z (26). Se passar, precisa lógica complexa.
                // Mas worksheet.mergeCells aceita coordenadas numéricas: (top, left, bottom, right)
                // A, RowNum, LastColLetter?, RowNum.
                // Melhor usar coordenadas (row, col, row, col)
                // top: sectionRow.number, left: 1, bottom: sectionRow.number, right: activeColumns.length

                worksheet.mergeCells(sectionRow.number, 1, sectionRow.number, activeColumns.length);

                sectionRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
                sectionRow.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF4F46E5' } // Indigo mais escuro
                };
                sectionRow.alignment = { horizontal: 'center' };

                // Adicionar trabalhadores
                sectionRows.forEach(addInscricaoRow);
            }
        }

        // 2. Trabalhadores SEM função ou função fora da lista padrão
        const outrosRows = dataRows.filter(r => !r.funcaoTrabalhador || !ORDEM_FUNCOES.includes(r.funcaoTrabalhador));

        if (outrosRows.length > 0) {
            worksheet.addRow([]);
            const sectionRow = worksheet.addRow(['OUTROS / SEM FUNÇÃO DEFINIDA']);
            worksheet.mergeCells(sectionRow.number, 1, sectionRow.number, activeColumns.length);
            sectionRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
            sectionRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF6B7280' } // Cinza
            };
            sectionRow.alignment = { horizontal: 'center' };

            outrosRows.forEach(addInscricaoRow);
        }

    } else {
        // MODO PADRÃO (Lista Simples)
        dataRows.forEach(addInscricaoRow);
    }

    return await workbook.xlsx.writeBuffer();
};
