import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import path from 'path';

const prisma = new PrismaClient();

async function importWorkers() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.resolve('d:/SISTEMA_EJC/Inscrições para Encontreiros (serviço) - XXIX EJC AUXILIADORA (respostas).xlsx');

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        let imported = 0;
        let errors = 0;

        // Skip header row
        for (let i = 2; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const values = row.values;

            if (!values[2]) continue; // Skip empty rows

            const tipoStr = (values[3] || '').toString().toLowerCase();
            const isCasal = tipoStr.includes('casal') || tipoStr.includes('união');

            let data = {
                status: 'APROVADA',
                email: values[2].toString(),
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
                    paroquiaEjcAno: (values[27] || '').toString(),
                    equipesJaServiram: (values[28] || '').toString(),
                    tocaInstrumento: (values[29] || '').toString().toLowerCase() === 'sim',
                    qualInstrumento: (values[30] || '').toString(),
                    sabeCantar: (values[31] || '').toString().toLowerCase() === 'sim',
                    operaEquipamentosSom: (values[32] || '').toString().toLowerCase() === 'sim',
                    habilidadesComputador: (values[33] || '').toString().toLowerCase() === 'sim',
                    trabalhosManuais: (values[34] || '').toString().toLowerCase() === 'sim',
                };
            } else {
                data = {
                    ...data,
                    nomeCompleto1: (values[4] || '').toString(),
                    contato1: (values[5] || '').toString(),
                    instagram1: (values[6] || '').toString(),
                    nomeCompleto2: '',
                    contato2: '',
                    instagram2: '',
                    enderecoCompleto: (values[7] || '').toString(),
                    trabalhamOuEstudam: (values[8] || '').toString().toLowerCase() === 'sim',
                    areaTrabalhoEstudo: (values[9] || '').toString(),
                    paroquiaEjcAno: (values[10] || '').toString(),
                    equipesJaServiram: (values[11] || '').toString(),
                    tocaInstrumento: (values[12] || '').toString().toLowerCase() === 'sim',
                    qualInstrumento: (values[13] || '').toString(),
                    sabeCantar: (values[14] || '').toString().toLowerCase() === 'sim',
                    operaEquipamentosSom: (values[15] || '').toString().toLowerCase() === 'sim',
                    habilidadesComputador: (values[16] || '').toString().toLowerCase() === 'sim',
                    trabalhosManuais: (values[17] || '').toString().toLowerCase() === 'sim',
                };
            }

            try {
                await prisma.inscricaoTrabalhador.create({ data });
                imported++;
                console.log(`[OK] Importado: ${data.nomeCompleto1}`);
            } catch (err) {
                errors++;
                console.error(`[ERRO] Falha ao importar ${data.nomeCompleto1}:`, err.message);
            }
        }

        console.log(`\n--- RESULTADO ---`);
        console.log(`Sucesso: ${imported}`);
        console.log(`Falhas: ${errors}`);
        console.log(`Total processado: ${imported + errors}`);

    } catch (error) {
        console.error('Erro crítico na importação:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importWorkers();
