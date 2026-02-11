import ExcelJS from 'exceljs';
import path from 'path';

async function findHeader() {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'd:/SISTEMA_EJC/XXIX EJC Auxiliadora  (respostas).xlsx';

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];
        const headers = worksheet.getRow(1).values;

        headers.forEach((h, i) => {
            if (h) {
                console.log(`Index [${i}]: ${h}`);
                if (h.toString().toLowerCase().includes('anexar foto')) {
                    console.log(`>>> PHOTO HEADER FOUND AT INDEX ${i} <<<`);
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
}

findHeader();
