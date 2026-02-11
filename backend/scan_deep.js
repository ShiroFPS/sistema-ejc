import ExcelJS from 'exceljs';

async function scanDeep() {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'd:/SISTEMA_EJC/XXIX EJC Auxiliadora  (respostas).xlsx';

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];
        console.log(`Scanning all ${worksheet.rowCount} rows...`);

        for (let i = 1; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const val4 = row.getCell(4).value;
            if (val4 && val4.toString().trim().length > 2 && i > 1) {
                console.log(`[Row ${i}] Column 4: ${val4}`);
                // Print photo col too
                console.log(`      Column 33: ${row.getCell(33).value}`);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

scanDeep();
