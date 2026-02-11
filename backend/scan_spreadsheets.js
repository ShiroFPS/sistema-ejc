import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

async function scan() {
    const files = [
        'XXIX EJC Auxiliadora  (respostas).xlsx',
        'Inscrições para Encontreiros (serviço) - XXIX EJC AUXILIADORA (respostas).xlsx',
        'inscricoes_ejc_1769468632345.xlsx'
    ];

    for (const f of files) {
        const filePath = path.join('d:/SISTEMA_EJC', f);
        if (!fs.existsSync(filePath)) continue;

        console.log(`\n--- File: ${f} ---`);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        workbook.worksheets.forEach(ws => {
            console.log(`Sheet: "${ws.name}" | Rows: ${ws.rowCount}`);
            if (ws.rowCount > 0) {
                const row1 = ws.getRow(1).values;
                console.log('Headers sample:', JSON.stringify(row1).substring(0, 100));
            }
        });
    }
}

scan();
