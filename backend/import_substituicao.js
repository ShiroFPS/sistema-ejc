import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import path from 'path';

const prisma = new PrismaClient();

async function importSubstitutes() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.resolve('d:/SISTEMA_EJC/CONTROLE DE SUBSTITUIÇÃO - EJC XXIX.xlsx');

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        let count = 0;

        // Skip header row
        for (let i = 2; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const nome = row.getCell(2).value;
            const telefone = row.getCell(3).value;

            if (nome && telefone) {
                const nomeStr = String(nome).trim();
                const telefoneStr = String(telefone).trim();

                // Check if already exists by name (case-insensitive check simplified)
                const exists = await prisma.inscricaoTrabalhador.findFirst({
                    where: {
                        OR: [
                            { nomeCompleto1: nomeStr },
                            { nomeCompleto2: nomeStr }
                        ]
                    }
                });

                if (!exists) {
                    await prisma.inscricaoTrabalhador.create({
                        data: {
                            nomeCompleto1: nomeStr,
                            contato1: telefoneStr,
                            tipoInscricao: 'SOLTEIRO',
                            status: 'APROVADA', // Substitutes are usually already confirmed
                            grupoFuncional: String(row.getCell(4).value || 'SUBSTITUICAO').toUpperCase(),
                            // Minimal fields to satisfy schema if needed
                            email: '',
                            paroquiaEjcAno: 'Importado da Substituição',
                            equipesJaServiram: '',
                            instagram1: '',
                            apelido: nomeStr.split(' ')[0],
                            sexo1: 'MASCULINO', // Default, will be manually updated
                            dataNascimento1: new Date('2000-01-01'), // Placeholder
                            enderecoCompleto: 'A completar manualmente',
                        }
                    });
                    count++;
                }
            }
        }

        console.log(`Import completed: ${count} new records added.`);
    } catch (error) {
        console.error('Error during import:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importSubstitutes();
