import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

async function globalSearch() {
    const dir = 'd:/SISTEMA_EJC';
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.xlsx'));

    const targetName = 'miguelcoelhojp';
    const f = 'CONTROLE DE SUBSTITUIÇÃO - EJC XXIX.xlsx';

    for (const f of files) {
        const filePath = path.join(dir, f);
        console.log(`\nScanning: ${f}...`);

        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);

            for (const ws of workbook.worksheets) {
                let foundRow = -1;
                ws.eachRow((row, rowNumber) => {
                    const rowText = JSON.stringify(row.values);
                    if (rowText.toLowerCase().includes(targetName.toLowerCase())) {
                        foundRow = rowNumber;
                    }
                });

                if (foundRow !== -1) {
                    console.log(`>>> FOUND in ${f} | Sheet: ${ws.name} | Row: ${foundRow} <<<`);
                    const row = ws.getRow(foundRow);
                    console.log('Row values:', JSON.stringify(row.values).substring(0, 500));
                }
            }
        } catch (err) {
            // console.error(`Error reading ${f}:`, err.message);
        }
    }
}

globalSearch();
