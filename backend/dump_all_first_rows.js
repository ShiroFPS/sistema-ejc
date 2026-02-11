import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

async function dumpFirstRows() {
    const dir = 'd:/SISTEMA_EJC';
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.xlsx'));

    for (const f of files) {
        const filePath = path.join(dir, f);
        console.log(`\n--- ${f} ---`);
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            for (const ws of workbook.worksheets) {
                console.log(`Sheet: ${ws.name} | Rows: ${ws.rowCount}`);
                const row2 = ws.getRow(2);
                if (row2 && row2.values) {
                    console.log('Row 2 values sample:', JSON.stringify(row2.values).substring(0, 300));
                }
            }
        } catch (e) { }
    }
}

dumpFirstRows();
