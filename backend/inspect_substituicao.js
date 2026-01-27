import ExcelJS from 'exceljs';
import path from 'path';

async function readHeaders() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.resolve('d:/SISTEMA_EJC/CONTROLE DE SUBSTITUIÇÃO - EJC XXIX.xlsx');

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        console.log('--- EXCEL HEADERS ---');
        const headersRow = worksheet.getRow(1);
        headersRow.eachCell((cell, colNumber) => {
            console.log(`[${colNumber}] ${cell.value}`);
        });

        console.log('\n--- SAMPLE DATA (Row 2) ---');
        const sampleRow = worksheet.getRow(2);
        sampleRow.eachCell((cell, colNumber) => {
            console.log(`[${colNumber}] ${cell.value}`);
        });

    } catch (error) {
        console.error('Error reading Excel:', error);
    }
}

readHeaders();
