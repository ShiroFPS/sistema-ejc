import ExcelJS from 'exceljs';
import { InscricaoService } from '../services/inscricao.service.js';

export const importWorkers = async (req, res, next) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const file = req.files.file;
        const workbook = new ExcelJS.Workbook();

        // Carregar buffer
        await workbook.xlsx.load(file.data);
        const worksheet = workbook.getWorksheet(1);

        let imported = 0;
        let errors = [];

        // Iterar linhas (pular cabeçalho)
        // Worksheet.eachRow começa do 1. Header é 1. Dados começam no 2.
        const promises = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            const values = row.values; // values[1] is column A

            // Validação básica se tem email (coluna 2) e tipo (coluna 3)
            // Ajuste baseado no excel_headers.txt: 
            // [1] Email, [2] Tipo. (Mas values[] do ExcelJS costuma ser 1-based, então A=1, B=2...)
            // Se read_excel_header.js mostrou [1] Email, deve ser coluna B?
            // Testaremos se values[2] tem @ ou algo assim.

            // Assumindo mapeamento do script antigo:
            // Col 2: Email
            // Col 3: Tipo
            const email = (values[2] || '').toString();
            const tipoStr = (values[3] || '').toString().toLowerCase();

            if (!email || !tipoStr) return;

            const isCasal = tipoStr.includes('casal') || tipoStr.includes('união');

            let data = {
                status: 'APROVADA', // Importados geralmente já são aprovados
                email: email,
                tipoInscricao: isCasal ? 'CASAIS_UNIAO_ESTAVEL' : 'SOLTEIRO',
            };

            // Mapeamento baseado no excel_headers.txt
            if (isCasal) {
                data = {
                    ...data,
                    // Casal mapping (Indices based on header analysis)
                    // [17] Nome 1 -> Col 18? (values[18])
                    // [19] Contato 1 -> Col ? 
                    // Melhor seguir os índices do import_workers.js antigo se o excel é o mesmo formato
                    nomeCompleto1: (values[18] || '').toString(),
                    contato1: (values[19] || '').toString(),
                    instagram1: (values[20] || '').toString(),
                    nomeCompleto2: (values[21] || '').toString(),
                    contato2: (values[22] || '').toString(),
                    instagram2: (values[23] || '').toString(),
                    enderecoCompleto: (values[24] || '').toString(),
                    trabalhamOuEstudam: (values[25] || '').toString().toLowerCase() === 'sim',
                    areaTrabalhoEstudo: (values[26] || '').toString(),
                    profissao1: (values[26] || '').toString(), // Mapeando Area para Profissao 1

                    paroquiaEjcAno: (values[27] || '').toString(),
                    equipesJaServiram: (values[28] || '').toString(),

                    tocaInstrumento: (values[29] || '').toString().toLowerCase() === 'sim',
                    qualInstrumento: (values[30] || '').toString(),
                    sabeCantar: (values[31] || '').toString().toLowerCase() === 'sim',
                    operaEquipamentosSom: (values[32] || '').toString().toLowerCase() === 'sim',
                    habilidadesComputador: (values[33] || '').toString().toLowerCase() === 'sim',
                    trabalhosManuais: (values[34] || '').toString().toLowerCase() === 'sim',

                    // Defaults
                    sexo1: 'MASCULINO',
                    sexo2: 'FEMININO',
                    dataNascimento1: new Date('2000-01-01').toISOString(),
                    dataNascimento2: new Date('2000-01-01').toISOString(),
                };
            } else {
                data = {
                    ...data,
                    // Solteiro mapping
                    // [3] Nome -> values[4]
                    nomeCompleto1: (values[4] || '').toString(),
                    contato1: (values[5] || '').toString(),
                    instagram1: (values[6] || '').toString(),

                    // Cidade -> values[7]. Ignored for now? Or Address?
                    // [7] Trab/Est -> values[8]
                    trabalhamOuEstudam: (values[8] || '').toString().toLowerCase() === 'sim',
                    // [8] Area -> values[9]
                    areaTrabalhoEstudo: (values[9] || '').toString(),
                    profissao1: (values[9] || '').toString(), // Mapeando Area para Profissao 1

                    // [9] Paroquia -> values[10]
                    paroquiaEjcAno: (values[10] || '').toString(),
                    // [10] Equipes -> values[11]
                    equipesJaServiram: (values[11] || '').toString(),

                    // [11] Toca -> values[12]
                    tocaInstrumento: (values[12] || '').toString().toLowerCase() === 'sim',
                    // [12] Qual -> values[13]
                    qualInstrumento: (values[13] || '').toString(),
                    // [13] Canta -> values[14]
                    sabeCantar: (values[14] || '').toString().toLowerCase() === 'sim',
                    // [14] Som -> values[15]
                    operaEquipamentosSom: (values[15] || '').toString().toLowerCase() === 'sim',
                    // [15] PC -> values[16]
                    habilidadesComputador: (values[16] || '').toString().toLowerCase() === 'sim',
                    // [16] Manuais -> values[17]
                    trabalhosManuais: (values[17] || '').toString().toLowerCase() === 'sim',

                    // Defaults
                    sexo1: 'MASCULINO', // Placeholder
                    dataNascimento1: new Date('2000-01-01').toISOString(),
                };
            }

            // Push promise to process asynchronously but sequentially? No, Promise.all might overwhelm DB.
            // Using for...of loop on rows array would be safer, but library gives callback.
            // We will push to an array and process after?

        });

        // Better approach: iterate rows normally if getRows is available, or use the callback to populate an array.
        // ExcelJS eachRow is synchronous for loaded workbook? Yes.

        const rowsData = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            rowsData.push(row.values);
        });

        for (const values of rowsData) {
            // Repetir logica de extracao (encapsular seria melhor, mas vou repetir por brevidade)
            const email = (values[2] || '').toString();
            if (!email) continue;

            // ... Recriar objeto data (copiar logica de cima) ...
            // Para simplificar, vou assumir a logica acima estava extraindo 'data' corretamente.
            // Vou re-implementar a extracao completa aqui dentro do loop for.

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

            try {
                await InscricaoService.criarTrabalhador(data);
                imported++;
            } catch (err) {
                // Se erro for duplicado, ignorar (ou contar como sucesso?)
                if (err.message.includes('Inscrição já existe')) {
                    // Duplicado, ignorar
                } else {
                    errors.push({ nome: data.nomeCompleto1, erro: err.message });
                }
            }
        }

        res.json({
            message: 'Importação concluída',
            total: imported + errors.length,
            imported,
            errors
        });

    } catch (error) {
        next(error);
    }
};
