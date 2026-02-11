import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import { getDirectDriveUrl } from './src/utils/googleDrive.js';

const prisma = new PrismaClient();

async function fixPhotos() {
    const workbook = new ExcelJS.Workbook();
    // Path taken from my previous header check
    const filePath = 'd:/SISTEMA_EJC/XXIX EJC Auxiliadora  (respostas).xlsx';

    try {
        console.log('--- Starting Photo Fix ---');
        const dbCount = await prisma.inscricaoParticipante.count();
        console.log(`Participants in DB: ${dbCount}`);

        await workbook.xlsx.readFile(filePath);
        console.log('Worksheets found:', workbook.worksheets.map(w => w.name));
        const worksheet = workbook.worksheets[0]; // Try the first worksheet directly
        console.log(`Using worksheet: ${worksheet.name} with ${worksheet.rowCount} rows`);

        let updatedCount = 0;
        let notFoundCount = 0;

        for (let i = 2; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const nomeCompleto = (row.getCell(4).value || '').toString().trim();
            const rawFotoUrl = (row.getCell(33).value || '').toString().trim();

            if (!nomeCompleto || !rawFotoUrl) continue;

            const directFotoUrl = getDirectDriveUrl(rawFotoUrl);

            // Find participant by name (case-insensitive)
            const participant = await prisma.inscricaoParticipante.findFirst({
                where: {
                    nomeCompleto: {
                        equals: nomeCompleto,
                        mode: 'insensitive'
                    }
                }
            });

            if (participant) {
                await prisma.inscricaoParticipante.update({
                    where: { id: participant.id },
                    data: { fotoUrl: directFotoUrl }
                });
                console.log(`✅ Updated: ${nomeCompleto}`);
                updatedCount++;
            } else {
                notFoundCount++;
            }
        }

        console.log('\n--- Fix Summary ---');
        console.log(`Total Updated: ${updatedCount}`);
        console.log(`Not Found in DB: ${notFoundCount}`);
    } catch (err) {
        console.error('Error during fix:', err);
    } finally {
        await prisma.$disconnect();
    }
}

fixPhotos();
