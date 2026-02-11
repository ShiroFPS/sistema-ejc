import ExcelJS from 'exceljs';

async function findHeader() {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'd:/SISTEMA_EJC/inscricoes_ejc_1769468632345.xlsx';

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];
        const headers = worksheet.getRow(1).values;

        headers.forEach((h, i) => {
            if (h) {
                console.log(`Index [${i}]: ${h}`);
                if (h.toString().toLowerCase().includes('anexar foto') || h.toString().toLowerCase().includes('foto')) {
                    console.log(`>>> PHOTO HEADER FOUND AT INDEX ${i} <<<`);
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
}

findHeader();
