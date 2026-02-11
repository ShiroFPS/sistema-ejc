import ExcelJS from 'exceljs';

async function findData() {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'd:/SISTEMA_EJC/XXIX EJC Auxiliadora  (respostas).xlsx';

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];
        console.log(`Searching in ${worksheet.name} (${worksheet.rowCount} rows)...`);

        let found = 0;
        for (let i = 1; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const name = row.getCell(4).value;
            const photo = row.getCell(33).value;

            if (name && name.toString().length > 3 && !name.toString().toLowerCase().includes('qual o seu nome')) {
                console.log(`[Row ${i}] Name: ${name} | Photo: ${photo ? 'YES' : 'NO'}`);
                found++;
                if (found > 10) break; // Just find first 10
            }
        }

        if (found === 0) {
            console.log('No data found with Name in Column 4.');
            // Try searching all columns for a name-like value
            console.log('Scanning Row 2 for ANY data...');
            const row2 = worksheet.getRow(2);
            row2.eachCell({ includeEmpty: true }, (cell, col) => {
                if (cell.value) console.log(`Col ${col}: ${cell.value}`);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

findData();
