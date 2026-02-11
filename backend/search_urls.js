import ExcelJS from 'exceljs';

async function searchAnyUrl() {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'd:/SISTEMA_EJC/XXIX EJC Auxiliadora  (respostas).xlsx';

    try {
        await workbook.xlsx.readFile(filePath);
        const ws = workbook.worksheets[0];
        console.log(`Searching URLs in ${ws.name}...`);

        for (let i = 1; i <= ws.rowCount; i++) {
            const row = ws.getRow(i);
            row.eachCell((cell) => {
                const val = (cell.value || '').toString();
                if (val.includes('http') || val.includes('drive')) {
                    console.log(`[Row ${i}] Found: ${val.substring(0, 100)}`);
                }
            });
        }
    } catch (err) { }
}

searchAnyUrl();
