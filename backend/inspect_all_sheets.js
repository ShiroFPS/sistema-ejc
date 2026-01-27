import ExcelJS from 'exceljs';
import path from 'path';

async function inspectAllSheets() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.resolve('d:/SISTEMA_EJC/CONTROLE DE SUBSTITUIÇÃO - EJC XXIX.xlsx');

    try {
        await workbook.xlsx.readFile(filePath);
        console.log(`--- WORKBOOK INFO ---`);
        console.log(`Total Sheets: ${workbook.worksheets.length}`);

        workbook.eachSheet((worksheet, sheetId) => {
            console.log(`\nSheet [${sheetId}] NAME: ${worksheet.name}`);
            const headers = worksheet.getRow(1).values.filter(Boolean);
            console.log(`Headers: ${headers.join(' | ')}`);

            // Look for data in first 3 rows
            for (let i = 2; i <= Math.min(3, worksheet.rowCount); i++) {
                const row = worksheet.getRow(i);
                console.log(`Row ${i}: ${row.values.slice(1, 10).join(' | ')}`);
            }
        });

    } catch (error) {
        console.error('Error reading Excel:', error);
    }
}

inspectAllSheets();
