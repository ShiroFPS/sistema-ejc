import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

async function inspectAllSheets() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.resolve('d:/SISTEMA_EJC/CONTROLE DE SUBSTITUIÇÃO - EJC XXIX.xlsx');

    try {
        await workbook.xlsx.readFile(filePath);
        let report = `--- WORKBOOK REPORT ---\nTotal Sheets: ${workbook.worksheets.length}\n`;

        workbook.eachSheet((worksheet, sheetId) => {
            report += `\n[${sheetId}] Sheet: "${worksheet.name}"\n`;

            const rows = [];
            // Get first 5 rows to understand structure
            for (let i = 1; i <= Math.min(5, worksheet.rowCount); i++) {
                const row = worksheet.getRow(i);
                const values = [];
                for (let j = 1; j <= 10; j++) {
                    values.push(String(row.getCell(j).value || '').replace(/\n/g, ' '));
                }
                rows.push(`Row ${i}: ${values.join(' | ')}`);
            }
            report += rows.join('\n') + '\n';
        });

        fs.writeFileSync('all_sheets_report.txt', report);
        console.log('Report written to all_sheets_report.txt');

    } catch (error) {
        console.error('Error reading Excel:', error);
    }
}

inspectAllSheets();
