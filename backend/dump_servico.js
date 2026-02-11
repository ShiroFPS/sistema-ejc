import ExcelJS from 'exceljs';
import fs from 'fs';

async function dumpServico() {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'd:/SISTEMA_EJC/Inscrições para Encontreiros (serviço) - XXIX EJC AUXILIADORA (respostas).xlsx';

    try {
        await workbook.xlsx.readFile(filePath);
        let output = '';

        workbook.worksheets.forEach(ws => {
            output += `\n\n=== SHEET: ${ws.name} ===\n`;
            ws.eachRow((row, rowNumber) => {
                const values = row.values;
                output += `[Row ${rowNumber}] ${JSON.stringify(values)}\n`;
            });
        });

        fs.writeFileSync('servico_dump.txt', output);
        console.log('Dumped to servico_dump.txt');
    } catch (err) {
        console.error(err);
    }
}

dumpServico();
