import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

async function searchLinks() {
    const dir = 'd:/SISTEMA_EJC';
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.xlsx'));

    for (const f of files) {
        const filePath = path.join(dir, f);
        console.log(`\nScanning: ${f}...`);

        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);

            for (const ws of workbook.worksheets) {
                ws.eachRow((row, rowNumber) => {
                    row.eachCell((cell, colNumber) => {
                        const val = (cell.value || '').toString();
                        if (val.includes('drive.google.com') || val.includes('open?id=')) {
                            console.log(`>>> FOUND LINK in ${f} | Row: ${rowNumber} | Col: ${colNumber} <<<`);
                            console.log(`Value: ${val.substring(0, 100)}`);

                            // Check row name
                            const name = row.getCell(4).value;
                            console.log(`Name in Col 4: ${name}`);
                        }
                    });
                });
            }
        } catch (err) { }
    }
}

searchLinks();
