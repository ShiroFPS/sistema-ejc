import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import path from 'path';

const prisma = new PrismaClient();

async function importAllSubstitutes() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.resolve('d:/SISTEMA_EJC/CONTROLE DE SUBSTITUIÇÃO - EJC XXIX.xlsx');

    try {
        await workbook.xlsx.readFile(filePath);

        // Let's also clear the previous 6 imported ones to be clean (they had 'Importado da Substituição' in paroquiaEjcAno)
        const deleted = await prisma.inscricaoTrabalhador.deleteMany({
            where: { paroquiaEjcAno: 'Importado da Substituição' }
        });
        console.log(`Cleared ${deleted.count} previous records.`);

        let totalCount = 0;

        for (const worksheet of workbook.worksheets) {
            if (worksheet.name === 'Cálculos') continue;

            console.log(`Processing sheet: ${worksheet.name}...`);

            // Detect header row (usually 1, but "Espera" is 2)
            let startRow = 1;
            if (worksheet.name === 'Espera') startRow = 3; // Data starts at Row 3 (headings were in 1 and 2)
            else if (worksheet.getRow(1).getCell(2).value === 'NOME') startRow = 2;
            else if (worksheet.getRow(2).getCell(2).value === 'NOME') startRow = 3;

            for (let i = startRow; i <= worksheet.rowCount; i++) {
                const row = worksheet.getRow(i);
                let nomeRaw = row.getCell(2).value;
                let telRaw = row.getCell(3).value;

                // SPECIAL CASE: Externa has two sets of columns
                if (worksheet.name === 'Externa') {
                    // Process casais set (Col 2, 3)
                    await processRow(nomeRaw, telRaw);
                    // Process solteiros set (Col 9, 10)
                    await processRow(row.getCell(9).value, row.getCell(10).value);
                    continue;
                }

                await processRow(nomeRaw, telRaw);
            }
        }

        async function processRow(nome, tel) {
            if (!nome) return;

            const nomeStr = String(nome).trim();
            if (nomeStr === '' || nomeStr.toLowerCase().includes('nome') || nomeStr.toLowerCase() === 'mulheres' || nomeStr.toLowerCase() === 'homens') return;

            const telStr = tel ? String(tel).trim() : '';

            // Check for Casais (e.g. "Nome 1 e Nome 2")
            let isCasal = nomeStr.toLowerCase().includes(' e ') && !nomeStr.toLowerCase().includes('pastoral'); // Avoid "Pastoral e ..." if any

            // Check if already exists to avoid duplicates
            const exists = await prisma.inscricaoTrabalhador.findFirst({
                where: {
                    OR: [
                        { nomeCompleto1: nomeStr },
                        { nomeCompleto2: nomeStr }
                    ]
                }
            });

            if (!exists) {
                const data = {
                    status: 'PENDENTE',
                    tipoInscricao: isCasal ? 'CASAIS_UNIAO_ESTAVEL' : 'SOLTEIRO',
                    email: '',
                    contato1: telStr,
                    instagram1: '',
                    paroquiaEjcAno: 'Importado da Substituição',
                    equipesJaServiram: '',
                    enderecoCompleto: 'A completar manualmente',
                    sexo1: 'MASCULINO', // Default
                    dataNascimento1: new Date('2000-01-01'),
                };

                if (isCasal) {
                    const parts = nomeStr.split(/ e /i);
                    data.nomeCompleto1 = parts[0].trim();
                    data.nomeCompleto2 = parts[1] ? parts[1].trim() : '';
                    data.apelido = data.nomeCompleto1.split(' ')[0];
                    data.apelido2 = data.nomeCompleto2.split(' ')[0];

                    // Try to split phones if "/" exists
                    if (telStr.includes('/')) {
                        const telParts = telStr.split('/');
                        data.contato1 = telParts[0].trim();
                        data.contato2 = telParts[1].trim();
                    }
                } else {
                    data.nomeCompleto1 = nomeStr;
                    data.apelido = nomeStr.split(' ')[0];
                }

                await prisma.inscricaoTrabalhador.create({ data });
                totalCount++;
            }
        }

        console.log(`\nTOTAL IMPORT COMPLETED: ${totalCount} records added.`);
    } catch (error) {
        console.error('Error during import:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importAllSubstitutes();
