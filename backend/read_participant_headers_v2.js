import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'd:/SISTEMA_EJC/XXIX EJC Auxiliadora  (respostas).xlsx';

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        const headers = worksheet.getRow(1).values;

        let output = '--- PARTICIPANT HEADERS ---\n';
        headers.forEach((h, i) => {
            output += `[${i}] ${h}\n`;
        });

        const sample = worksheet.getRow(2).values;
        output += '\n--- SAMPLE ROW 2 ---\n';
        sample.forEach((s, i) => {
            output += `[${i}] ${s}\n`;
        });

        fs.writeFileSync('participant_headers_v2.txt', output, 'utf8');
        console.log('Headers written to participant_headers_v2.txt');
    } catch (err) {
        console.error(err);
    }
}

main();
