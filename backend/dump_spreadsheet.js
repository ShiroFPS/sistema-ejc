import ExcelJS from 'exceljs';

async function dump() {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'd:/SISTEMA_EJC/XXIX EJC Auxiliadora  (respostas).xlsx';

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];
        console.log(`Sheet: ${worksheet.name}, Rows: ${worksheet.rowCount}`);

        for (let i = 1; i <= Math.min(10, worksheet.rowCount); i++) {
            const row = worksheet.getRow(i);
            console.log(`\n--- ROW ${i} ---`);
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                console.log(`Col ${colNumber}: ${cell.value}`);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

dump();
