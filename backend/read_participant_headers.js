import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'd:/SISTEMA_EJC/XXIX EJC Auxiliadora  (respostas).xlsx';

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        const headers = worksheet.getRow(1).values;

        console.log('--- PARTICIPANT HEADERS ---');
        headers.forEach((h, i) => {
            console.log(`[${i}] ${h}`);
        });

        const sample = worksheet.getRow(2).values;
        console.log('\n--- SAMPLE ROW 2 ---');
        sample.forEach((s, i) => {
            console.log(`[${i}] ${s}`);
        });
    } catch (err) {
        console.error(err);
    }
}

main();
