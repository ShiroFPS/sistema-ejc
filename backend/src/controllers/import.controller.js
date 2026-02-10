import ExcelJS from 'exceljs';
import { InscricaoService } from '../services/inscricao.service.js';

export const importWorkers = async (req, res, next) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const file = req.files.file;
        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.load(file.data);
        const worksheet = workbook.getWorksheet(1);

        // Detectar tipo de arquivo pelo cabeçalho
        const headerRow = worksheet.getRow(1);
        const headers = [];
        headerRow.eachCell({ includeEmpty: true }, (cell) => {
            headers.push((cell.value || '').toString().toLowerCase());
        });

        // Heurística de detecção
        // Participantes tem "Como gostaria de ser chamado?" ou "Endereço completo do Pai"
        const isParticipantFile = headers.some(h =>
            h.includes('como gostaria de ser chamado') ||
            h.includes('telefone do pai') ||
            h.includes('endereço do pai')
        );

        console.log(`[IMPORT] Detectado tipo de arquivo: ${isParticipantFile ? 'PARTICIPANTE' : 'TRABALHADOR'}`);

        let imported = 0;
        let errors = [];

        const rowsData = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            rowsData.push({ values: row.values, rowNumber });
        });

        for (const item of rowsData) {
            const values = item.values;
            const rowNumber = item.rowNumber;

            try {
                if (isParticipantFile) {
                    // Mapeamento de Participantes
                    const data = {
                        status: 'APROVADA',
                        email: (values[2] || '').toString(),
                        lgpdCiente: true,
                        nomeCompleto: (values[4] || '').toString(),
                        apelido: (values[5] || '').toString() || (values[4] || '').toString().split(' ')[0],
                        dataNascimento: (values[6] || '').toString(),
                        sexo: (values[7] || '').toString().toUpperCase().startsWith('M') ? 'MASCULINO' : 'FEMININO',
                        telefone: (values[8] || '').toString(),
                        instagram: (values[9] || '').toString(),
                        estadoCivil: mapEstadoCivil((values[10] || '').toString()),
                        escolaridade: (values[11] || '').toString(),
                        instituicaoEnsino: (values[12] || '').toString(),
                        profissao: (values[13] || '').toString(),
                        trabalha: (values[13] || '').toString().toLowerCase().includes('sim'),
                        localTrabalho: (values[13] || '').toString(),
                        batizado: (values[14] || '').toString().toLowerCase().includes('sim'),
                        fezPrimeiraComunhao: (values[15] || '').toString().toLowerCase().includes('sim'),
                        fezCrisma: (values[16] || '').toString().toLowerCase().includes('sim'),
                        enderecoCompleto: (values[17] || '').toString(),
                        bairro: (values[18] || '').toString(),
                        moraComQuem: (values[19] || '').toString(),
                        estadoCivilPais: (values[20] || '').toString(),
                        nomeMae: (values[21] || '').toString(),
                        telefoneMae: (values[22] || '').toString(),
                        enderecoMae: (values[23] || '').toString(),
                        nomePai: (values[24] || '').toString(),
                        telefonePai: (values[25] || '').toString(),
                        enderecoPai: (values[26] || '').toString(),
                        amigosParentesInscritos: (values[27] || '').toString(),
                        contatosEmergencia: JSON.stringify([{
                            nome: 'Importado de: ' + (values[28] || '').toString().substring(0, 50),
                            telefone: 'Ver detalhes na planilha original'
                        }]),
                        restricoesAlimentares: (values[29] || '').toString(),
                        alergias: (values[30] || '').toString(),
                        problemasSaude: (values[31] || '').toString(),
                        medicamentosContinuos: (values[32] || '').toString(),
                    };

                    if (!data.nomeCompleto) continue;
                    await InscricaoService.criarParticipante(data);
                } else {
                    // Mapeamento de Trabalhadores
                    const email = (values[2] || '').toString();
                    const tipoStr = (values[3] || '').toString().toLowerCase();
                    const isCasal = tipoStr.includes('casal') || tipoStr.includes('união');

                    let data = {
                        status: 'APROVADA',
                        email: email,
                        tipoInscricao: isCasal ? 'CASAIS_UNIAO_ESTAVEL' : 'SOLTEIRO',
                    };

                    if (isCasal) {
                        data = {
                            ...data,
                            nomeCompleto1: (values[18] || '').toString(),
                            contato1: (values[19] || '').toString(),
                            instagram1: (values[20] || '').toString(),
                            nomeCompleto2: (values[21] || '').toString(),
                            contato2: (values[22] || '').toString(),
                            instagram2: (values[23] || '').toString(),
                            enderecoCompleto: (values[24] || '').toString(),
                            trabalhamOuEstudam: (values[25] || '').toString().toLowerCase() === 'sim',
                            areaTrabalhoEstudo: (values[26] || '').toString(),
                            profissao1: (values[26] || '').toString(),
                            paroquiaEjcAno: (values[27] || '').toString(),
                            equipesJaServiram: (values[28] || '').toString(),
                            tocaInstrumento: (values[29] || '').toString().toLowerCase() === 'sim',
                            qualInstrumento: (values[30] || '').toString(),
                            sabeCantar: (values[31] || '').toString().toLowerCase() === 'sim',
                            operaEquipamentosSom: (values[32] || '').toString().toLowerCase() === 'sim',
                            habilidadesComputador: (values[33] || '').toString().toLowerCase() === 'sim',
                            trabalhosManuais: (values[34] || '').toString().toLowerCase() === 'sim',
                            sexo1: 'MASCULINO',
                            sexo2: 'FEMININO',
                            dataNascimento1: new Date('2000-01-01').toISOString(),
                            dataNascimento2: new Date('2000-01-01').toISOString(),
                        };
                    } else {
                        data = {
                            ...data,
                            nomeCompleto1: (values[4] || '').toString(),
                            contato1: (values[5] || '').toString(),
                            instagram1: (values[6] || '').toString(),
                            enderecoCompleto: (values[7] || '').toString() || 'Importado via Excel',
                            trabalhamOuEstudam: (values[8] || '').toString().toLowerCase() === 'sim',
                            areaTrabalhoEstudo: (values[9] || '').toString(),
                            profissao1: (values[9] || '').toString(),
                            paroquiaEjcAno: (values[10] || '').toString(),
                            equipesJaServiram: (values[11] || '').toString(),
                            tocaInstrumento: (values[12] || '').toString().toLowerCase() === 'sim',
                            qualInstrumento: (values[13] || '').toString(),
                            sabeCantar: (values[14] || '').toString().toLowerCase() === 'sim',
                            operaEquipamentosSom: (values[15] || '').toString().toLowerCase() === 'sim',
                            habilidadesComputador: (values[16] || '').toString().toLowerCase() === 'sim',
                            trabalhosManuais: (values[17] || '').toString().toLowerCase() === 'sim',
                            sexo1: 'MASCULINO',
                            dataNascimento1: new Date('2000-01-01').toISOString(),
                        };
                    }

                    if (!data.nomeCompleto1) continue;
                    await InscricaoService.criarTrabalhador(data);
                }
                imported++;
            } catch (err) {
                const errorTrace = err.message || 'Erro desconhecido';
                const name = isParticipantFile ? (values[4] || `Linha ${rowNumber}`) : (values[4] || `Linha ${rowNumber}`);
                if (errorTrace.includes('Inscrição já existe')) {
                    // Ignorar duplicados
                } else {
                    errors.push({ nome: name.toString(), erro: errorTrace });
                }
            }
        }

        res.json({
            message: 'Importação concluída',
            type: isParticipantFile ? 'PARTICIPANTE' : 'TRABALHADOR',
            total: imported + errors.length,
            imported,
            errors
        });

    } catch (error) {
        next(error);
    }
};

function mapEstadoCivil(val) {
    const s = val.toLowerCase();
    if (s.includes('casado')) return 'CASADO';
    if (s.includes('união') || s.includes('uniao')) return 'UNIAO_ESTAVEL';
    if (s.includes('divorciado')) return 'DIVORCIADO';
    if (s.includes('viúvo') || s.includes('viuvo')) return 'VIUVO';
    return 'SOLTEIRO';
}
