import ExcelJS from 'exceljs';

async function deepSearch() {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'd:/SISTEMA_EJC/XXIX EJC Auxiliadora  (respostas).xlsx';

    try {
        await workbook.xlsx.readFile(filePath);
        const ws = workbook.worksheets[0];
        console.log(`Searching ${ws.rowCount} rows in ${ws.name}...`);

        for (let i = 1; i <= ws.rowCount; i++) {
            const row = ws.getRow(i);
            let hasData = false;
            row.eachCell((cell) => {
                if (cell.value) {
                    const text = cell.value.toString();
                    if (text.includes('Miguel') || text.includes('Davi') || text.includes('google.com')) {
                        console.log(`[Row ${i}] Matched: ${text}`);
                        hasData = true;
                    }
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
}

deepSearch();
