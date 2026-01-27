import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

async function inspectExcel() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.resolve('d:/SISTEMA_EJC/Inscrições para Encontreiros (serviço) - XXIX EJC AUXILIADORA (respostas).xlsx');

    try {
        await workbook.xlsx.readFile(filePath);
        let output = '=== EXCEL INSPECTION ===\n\n';

        output += `Sheets found: ${workbook.worksheets.map(ws => ws.name).join(', ')}\n\n`;

        workbook.worksheets.forEach(ws => {
            output += `--- Sheet: ${ws.name} ---\n`;
            const headerRow = ws.getRow(1);
            output += `Total Columns (with data): ${ws.actualColumnCount}\n`;

            headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                output += `Col [${colNumber}]: ${cell.value}\n`;
            });
            output += '\n';
        });

        fs.writeFileSync('excel_full_inspection.txt', output);
        console.log('Inspection written to excel_full_inspection.txt');
    } catch (error) {
        console.error('Error inspecting Excel:', error);
    }
}

inspectExcel();
