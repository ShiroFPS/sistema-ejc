import PDFDocument from 'pdfkit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const gerarFichaEntrevista = async (inscricaoId) => {
    const inscricao = await prisma.inscricao.findUnique({
        where: { id: inscricaoId },
    });

    if (!inscricao) {
        throw new Error('Inscrição não encontrada');
    }

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Cabeçalho
            doc.fontSize(18).text('FICHA DE ENTREVISTA - EJC', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Tipo: ${inscricao.tipo}`, { align: 'center' });
            if (inscricao.grupoFuncional) {
                doc.text(`Grupo Funcional: ${inscricao.grupoFuncional}`, { align: 'center' });
            }
            doc.moveDown(2);

            // Dados Pessoais
            doc.fontSize(14).text('DADOS PESSOAIS', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10);
            doc.text(`Nome Completo: ${inscricao.nomeCompleto}`);
            doc.text(`Apelido: ${inscricao.apelido}`);
            doc.text(`Data de Nascimento: ${new Date(inscricao.dataNascimento).toLocaleDateString('pt-BR')}`);
            doc.text(`Sexo: ${inscricao.sexo}`);
            doc.text(`Telefone: ${inscricao.telefone}`);
            if (inscricao.instagram) doc.text(`Instagram: ${inscricao.instagram}`);
            doc.moveDown();

            // Estado Civil e Profissão
            doc.text(`Estado Civil: ${inscricao.estadoCivil}`);
            doc.text(`Escolaridade: ${inscricao.escolaridade}`);
            doc.text(`Profissão: ${inscricao.profissao}`);
            if (inscricao.trabalha) doc.text(`Local de Trabalho: ${inscricao.localTrabalho}`);
            doc.moveDown(2);

            // Endereço
            doc.fontSize(14).text('ENDEREÇO', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10);
            doc.text(`Endereço: ${inscricao.enderecoCompleto}`);
            doc.text(`Bairro: ${inscricao.bairro}`);
            doc.text(`Mora com: ${inscricao.moraComQuem}`);
            doc.moveDown(2);

            // Dados dos Pais
            doc.fontSize(14).text('DADOS DOS PAIS', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10);
            doc.text(`Mãe: ${inscricao.nomeMae}`);
            doc.text(`Telefone da Mãe: ${inscricao.telefoneMae}`);
            doc.text(`Pai: ${inscricao.nomePai}`);
            doc.text(`Telefone do Pai: ${inscricao.telefonePai}`);
            doc.moveDown(2);

            // Informações de Saúde
            doc.fontSize(14).text('INFORMAÇÕES DE SAÚDE', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10);
            if (inscricao.restricoesAlimentares) {
                doc.text(`Restrições Alimentares: ${inscricao.restricoesAlimentares}`);
            }
            if (inscricao.alergias) {
                doc.text(`Alergias: ${inscricao.alergias}`);
            }
            if (inscricao.problemasSaude) {
                doc.text(`Problemas de Saúde: ${inscricao.problemasSaude}`);
            }
            if (inscricao.medicamentosContinuos) {
                doc.text(`Medicamentos Contínuos: ${inscricao.medicamentosContinuos}`);
            }
            doc.moveDown(2);

            // Observações
            doc.fontSize(14).text('OBSERVAÇÕES DA ENTREVISTA', { underline: true });
            doc.moveDown(3);
            doc.text('_'.repeat(80));
            doc.moveDown();
            doc.text('_'.repeat(80));
            doc.moveDown();
            doc.text('_'.repeat(80));

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export const gerarListaPresenca = async (filtros = {}) => {
    const where = {};
    if (filtros.tipo) where.tipo = filtros.tipo;
    if (filtros.grupoFuncional) where.grupoFuncional = filtros.grupoFuncional;
    if (filtros.status) where.status = filtros.status;

    const inscricoes = await prisma.inscricao.findMany({
        where,
        orderBy: { nomeCompleto: 'asc' },
    });

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
            const chunks = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Cabeçalho
            doc.fontSize(16).text('LISTA DE PRESENÇA - EJC', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Total: ${inscricoes.length} pessoas`, { align: 'center' });
            doc.moveDown(2);

            // Tabela
            const tableTop = doc.y;
            const itemHeight = 25;

            // Headers
            doc.fontSize(9).font('Helvetica-Bold');
            doc.text('#', 30, tableTop, { width: 30 });
            doc.text('Nome', 60, tableTop, { width: 200 });
            doc.text('Apelido', 260, tableTop, { width: 100 });
            doc.text('Telefone', 360, tableTop, { width: 100 });
            doc.text('Grupo', 460, tableTop, { width: 80 });
            doc.text('Assinatura', 540, tableTop, { width: 200 });

            doc.font('Helvetica');
            doc.moveTo(30, tableTop + 15).lineTo(750, tableTop + 15).stroke();

            // Linhas
            inscricoes.forEach((inscricao, index) => {
                const y = tableTop + itemHeight * (index + 1);

                if (y > 550) {
                    doc.addPage();
                    return;
                }

                doc.fontSize(8);
                doc.text(index + 1, 30, y, { width: 30 });
                doc.text(inscricao.nomeCompleto.substring(0, 30), 60, y, { width: 200 });
                doc.text(inscricao.apelido, 260, y, { width: 100 });
                doc.text(inscricao.telefone, 360, y, { width: 100 });

                if (inscricao.grupoFuncional) {
                    doc.text(inscricao.grupoFuncional, 460, y, { width: 80 });
                }

                doc.moveTo(30, y + 20).lineTo(750, y + 20).stroke();
            });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
