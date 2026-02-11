import ExcelJS from 'exceljs';
import fs from 'fs';

async function dumpAll() {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'd:/SISTEMA_EJC/CONTROLE DE SUBSTITUIÇÃO - EJC XXIX.xlsx';

    try {
        await workbook.xlsx.readFile(filePath);
        let output = '';

        workbook.worksheets.forEach(ws => {
            output += `\n\n=== SHEET: ${ws.name} ===\n`;
            ws.eachRow((row, rowNumber) => {
                const values = row.values;
                output += `[Row ${rowNumber}] ${JSON.stringify(values)}\n`;
            });
        });

        fs.writeFileSync('big_dump.txt', output);
        console.log('Dumped to big_dump.txt');
    } catch (err) {
        console.error(err);
    }
}

dumpAll();
