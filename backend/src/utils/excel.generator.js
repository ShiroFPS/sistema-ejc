import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const gerarExcel = async (filtros = {}) => {
    const where = {};
    if (filtros.status) where.status = filtros.status;
    if (filtros.grupoFuncional) where.grupoFuncional = filtros.grupoFuncional;
    if (filtros.funcaoTrabalhador) where.funcaoTrabalhador = filtros.funcaoTrabalhador;
    if (filtros.corGrupo) where.corGrupo = filtros.corGrupo;

    let inscricoes = [];

    // Buscar Participantes (se não houver filtro de tipo ou se for PARTICIPANTE)
    if (!filtros.tipo || filtros.tipo === 'PARTICIPANTE') {
        const participantesWhere = filtros.status ? { status: filtros.status } : {};
        if (filtros.corGrupo) participantesWhere.corGrupo = filtros.corGrupo;

        const participantes = await prisma.inscricaoParticipante.findMany({
            where: participantesWhere,
            orderBy: { createdAt: 'desc' },
        });
        // Marcar tipo diretamente
        for (const p of participantes) {
            p.tipo = 'PARTICIPANTE';
            inscricoes.push(p);
        }
    }

    // Buscar Trabalhadores (se não houver filtro de tipo ou se for TRABALHADOR)
    if (!filtros.tipo || filtros.tipo === 'TRABALHADOR') {
        const trabalhadoresWhere = {};
        if (filtros.status) trabalhadoresWhere.status = filtros.status;
        if (filtros.grupoFuncional) trabalhadoresWhere.grupoFuncional = filtros.grupoFuncional;
        if (filtros.funcaoTrabalhador) trabalhadoresWhere.funcaoTrabalhador = filtros.funcaoTrabalhador;

        const trabalhadores = await prisma.inscricaoTrabalhador.findMany({
            where: trabalhadoresWhere,
            orderBy: { createdAt: 'desc' },
        });
        for (const t of trabalhadores) {
            t.tipo = 'TRABALHADOR';
            inscricoes.push(t);
        }
    }

    // Ordem oficial das funções
    const ORDEM_FUNCOES = [
        'Equipe dirigente', 'Coordenação Geral', 'Boa Vontade', 'Banda',
        'Apresentadores', 'Sociodrama', 'Som & Iluminação', 'Liturgia & Vigília',
        'Externa', 'Secretaria', 'Círculos', 'Tráfego, Correios e Compras',
        'Lanchinho', 'Cozinha', 'Minibox', 'Ordem', 'Trânsito & Recepção'
    ];

    // Cache indices for faster lookup
    const funcaoIndexMap = new Map();
    ORDEM_FUNCOES.forEach((f, i) => funcaoIndexMap.set(f, i));

    // Ordenação Otimizada
    inscricoes.sort((a, b) => {
        // Se ambos têm função, ordena pela função
        if (a.funcaoTrabalhador && b.funcaoTrabalhador) {
            const indexA = funcaoIndexMap.has(a.funcaoTrabalhador) ? funcaoIndexMap.get(a.funcaoTrabalhador) : -1;
            const indexB = funcaoIndexMap.has(b.funcaoTrabalhador) ? funcaoIndexMap.get(b.funcaoTrabalhador) : -1;

            if (indexA !== -1 && indexB !== -1) {
                if (indexA !== indexB) return indexA - indexB;
            }
        }

        // Desempata pela data (mais recente primeiro)
        // createdAt vem do Prisma como Date object
        const timeA = a.createdAt ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.getTime() : 0;
        return timeB - timeA;
    });

    // Colunas Possíveis
    const allColumns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Código Verificação', key: 'codigoVerificacao', width: 15 },
        { header: 'Cor Grupo', key: 'corGrupo', width: 15 },
        { header: 'Grupo Funcional', key: 'grupoFuncional', width: 20 },
        { header: 'Função', key: 'funcaoTrabalhador', width: 20 },
        { header: 'Nome Completo 1', key: 'nomeCompleto1', width: 30 },
        { header: 'Apelido 1', key: 'apelido', width: 20 },
        { header: 'Data Nascimento 1', key: 'dataNascimento1', width: 15 },
        { header: 'Sexo 1', key: 'sexo1', width: 12 },
        { header: 'Telefone 1', key: 'contato1', width: 15 },
        { header: 'Instagram 1', key: 'instagram1', width: 20 },
        { header: 'Nome Completo 2', key: 'nomeCompleto2', width: 30 },
        { header: 'Apelido 2', key: 'apelido2', width: 20 },
        { header: 'Data Nascimento 2', key: 'dataNascimento2', width: 15 },
        { header: 'Sexo 2', key: 'sexo2', width: 12 },
        { header: 'Telefone 2', key: 'contato2', width: 15 },
        { header: 'Instagram 2', key: 'instagram2', width: 20 },
        { header: 'E-mail', key: 'email', width: 25 },
        { header: 'Endereço', key: 'enderecoCompleto', width: 40 },
        { header: 'Trabalha/Estuda', key: 'trabalhamOuEstudam', width: 15 },
        { header: 'Área', key: 'areaTrabalhoEstudo', width: 20 },
        { header: 'Paróquia/Ano EJC', key: 'paroquiaEjcAno', width: 25 },
        { header: 'Equipes que Serviu', key: 'equipesJaServiram', width: 30 },
        { header: 'Toca Instrumento', key: 'tocaInstrumento', width: 15 },
        { header: 'Qual Instrumento', key: 'qualInstrumento', width: 20 },
        { header: 'Sabe Cantar', key: 'sabeCantar', width: 12 },
        { header: 'Opera Som', key: 'operaEquipamentosSom', width: 12 },
        { header: 'Habilidades PC', key: 'habilidadesComputador', width: 12 },
        { header: 'Trabalhos Manuais', key: 'trabalhosManuais', width: 15 },
        // Campos de Participante
        { header: 'Nome Completo', key: 'nomeCompleto', width: 30 },
        { header: 'Apelido', key: 'apelido_p', width: 20 },
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

    // Set para rastrear colunas ativas
    const activeKeys = new Set(['id', 'tipo', 'status', 'createdAt']); // Campos sempre visíveis

    const dataRows = inscricoes.map(inscricao => {
        const row = {
            id: inscricao.id.substring(0, 8),
            tipo: inscricao.tipo,
            status: inscricao.status,
            codigoVerificacao: inscricao.codigoVerificacao || '',
            corGrupo: inscricao.corGrupo || '',
            grupoFuncional: ['VERDE', 'AMARELO', 'VERMELHO', 'AZUL', 'LARANJA'].includes(inscricao.grupoFuncional) ? inscricao.grupoFuncional : '',
            funcaoTrabalhador: inscricao.funcaoTrabalhador || '',
            // Pessoa 1 / Única
            nomeCompleto1: inscricao.nomeCompleto1 || '',
            apelido: inscricao.apelido || '',
            dataNascimento1: inscricao.dataNascimento1 ? new Date(inscricao.dataNascimento1).toLocaleDateString('pt-BR') : '',
            sexo1: inscricao.sexo1 || '',
            contato1: inscricao.contato1 || '',
            instagram1: inscricao.instagram1 || '',
            // Pessoa 2
            nomeCompleto2: inscricao.nomeCompleto2 || '',
            apelido2: inscricao.apelido2 || '',
            dataNascimento2: inscricao.dataNascimento2 ? new Date(inscricao.dataNascimento2).toLocaleDateString('pt-BR') : '',
            sexo2: inscricao.sexo2 || '',
            contato2: inscricao.contato2 || '',
            instagram2: inscricao.instagram2 || '',
            // Geral Trabalhador
            email: inscricao.email || '',
            trabalhamOuEstudam: inscricao.trabalhamOuEstudam ? 'Sim' : 'Não',
            areaTrabalhoEstudo: inscricao.areaTrabalhoEstudo || '',
            paroquiaEjcAno: inscricao.paroquiaEjcAno || '',
            equipesJaServiram: inscricao.equipesJaServiram || '',
            tocaInstrumento: inscricao.tocaInstrumento ? 'Sim' : 'Não',
            qualInstrumento: inscricao.qualInstrumento || '',
            sabeCantar: inscricao.sabeCantar ? 'Sim' : 'Não',
            operaEquipamentosSom: inscricao.operaEquipamentosSom ? 'Sim' : 'Não',
            habilidadesComputador: inscricao.habilidadesComputador ? 'Sim' : 'Não',
            trabalhosManuais: inscricao.trabalhosManuais ? 'Sim' : 'Não',
            // Participante
            nomeCompleto: inscricao.nomeCompleto || '',
            apelido_p: inscricao.tipo === 'PARTICIPANTE' ? (inscricao.apelido || '') : '',
            dataNascimento: inscricao.dataNascimento ? new Date(inscricao.dataNascimento).toLocaleDateString('pt-BR') : '',
            sexo: inscricao.sexo || '',
            telefone: inscricao.telefone || '',
            instagram: inscricao.instagram || '',
            estadoCivil: inscricao.estadoCivil || '',
            escolaridade: inscricao.escolaridade || '',
            profissao: inscricao.profissao || '',
            trabalha: inscricao.trabalha ? 'Sim' : 'Não',
            localTrabalho: inscricao.localTrabalho || '',
            batizado: inscricao.batizado ? 'Sim' : 'Não',
            fezPrimeiraComunhao: inscricao.fezPrimeiraComunhao ? 'Sim' : 'Não',
            fezCrisma: inscricao.fezCrisma ? 'Sim' : 'Não',
            enderecoCompleto: inscricao.enderecoCompleto || '',
            bairro: inscricao.bairro || '',
            moraComQuem: inscricao.moraComQuem || '',
            nomeMae: inscricao.nomeMae || '',
            telefoneMae: inscricao.telefoneMae || '',
            nomePai: inscricao.nomePai || '',
            telefonePai: inscricao.telefonePai || '',
            amigosParentesInscritos: inscricao.amigosParentesInscritos || '',
            restricoesAlimentares: inscricao.restricoesAlimentares || '',
            alergias: inscricao.alergias || '',
            problemasSaude: inscricao.problemasSaude || '',
            medicamentosContinuos: inscricao.medicamentosContinuos || '',
            createdAt: inscricao.createdAt ? new Date(inscricao.createdAt).toLocaleString('pt-BR') : '',
        };

        // Check active columns while mapping
        for (const key of Object.keys(row)) {
            // Se o valor existe e não é vazio, marca a coluna como ativa
            // Ignora chaves que não estão no allColumns (ex: funcaoTrabalhador) será filtrado depois
            if (row[key] !== '' && row[key] !== null && row[key] !== undefined) {
                activeKeys.add(key);
            }
        }
        return row;
    });

    // Filtra definitions baseado no set
    const activeColumns = allColumns.filter(col => activeKeys.has(col.key));

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

    const addInscricaoRow = (row) => {
        worksheet.addRow(row);
    };

    if (filtros.agrupado === 'true' && filtros.tipo === 'TRABALHADOR') {
        // MODO AGRUPADO POR FUNÇÃO

        // 1. Iterar sobre a ordem oficial
        for (const funcao of ORDEM_FUNCOES) {
            const sectionRows = dataRows.filter(r => r.funcaoTrabalhador === funcao);

            if (sectionRows.length > 0) {
                if (worksheet.rowCount > 1) worksheet.addRow([]);

                const sectionRow = worksheet.addRow([funcao.toUpperCase()]);
                // Merge seguro
                if (activeColumns.length > 1) {
                    worksheet.mergeCells(sectionRow.number, 1, sectionRow.number, activeColumns.length);
                }

                sectionRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
                sectionRow.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF4F46E5' }
                };
                sectionRow.alignment = { horizontal: 'center' };

                sectionRows.forEach(addInscricaoRow);
            }
        }

        // 2. Outros
        const outrosRows = dataRows.filter(r => !r.funcaoTrabalhador || !funcaoIndexMap.has(r.funcaoTrabalhador));

        if (outrosRows.length > 0) {
            worksheet.addRow([]);
            const sectionRow = worksheet.addRow(['OUTROS / SEM FUNÇÃO DEFINIDA']);
            if (activeColumns.length > 1) {
                worksheet.mergeCells(sectionRow.number, 1, sectionRow.number, activeColumns.length);
            }
            sectionRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
            sectionRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF6B7280' }
            };
            sectionRow.alignment = { horizontal: 'center' };

            outrosRows.forEach(addInscricaoRow);
        }

    } else {
        // MODO PADRÃO
        dataRows.forEach(addInscricaoRow);
    }

    return await workbook.xlsx.writeBuffer();
};
