import ExcelJS from 'exceljs';
import path from 'path';

async function readHeaders() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.resolve('d:/SISTEMA_EJC/Inscrições para Encontreiros (serviço) - XXIX EJC AUXILIADORA (respostas).xlsx');

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        const fs = await import('fs');
        const headers = worksheet.getRow(1).values.filter(Boolean);
        let output = '--- EXCEL HEADERS ---\n';
        headers.forEach((h, i) => {
            output += `[${i}] ${h}\n`;
        });
        output += `TOTAL: ${headers.length}\n\n`;

        output += '--- SAMPLE DATA (Row 2) ---\n';
        const sampleRow = worksheet.getRow(2).values;
        sampleRow.forEach((val, i) => {
            output += `[${i}] ${val}\n`;
        });

        fs.writeFileSync('excel_headers.txt', output);
        console.log('Headers and sample written to excel_headers.txt');
    } catch (error) {
        console.error('Error reading Excel:', error);
    }
}

readHeaders();
