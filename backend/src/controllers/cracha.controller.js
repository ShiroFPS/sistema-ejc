import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

// Caminho para a logo (ajustar conforme estrutura de pastas)
// Controller está em: backend/src/controllers
// Logo está em: frontend/src/assets/logo-ejc.jpg
const LOGO_PATH = path.resolve(__dirname, '../../../frontend/src/assets/logo-ejc.jpg');

// CONVERSÃO MM para POINTS (1mm = 2.83465pt)
const mmToPt = (mm) => mm * 2.83465;

// DIMENSÕES PADRÃO ID-1 (Cartão de Crédito)
const CARD_WIDTH = mmToPt(85.60);  // ~242.64 pt
const CARD_HEIGHT = mmToPt(53.98); // ~153.02 pt
const FULL_WIDTH = CARD_WIDTH * 2; // ~485.28 pt (Verso + Frente)

// Função auxiliar para desenhar um crachá em uma posição específica
const desenharCracha = (doc, inscricao, x, y) => {
    const middleX = x + CARD_WIDTH; // Linha da dobra

    // Código curto
    const codigoCurto = inscricao.codigoVerificacao ? inscricao.codigoVerificacao.slice(0, 6).toUpperCase() : '000000';

    // Cor da faixa e destaque
    const corFaixa = {
        'VERDE': '#22c55e',
        'AMARELO': '#eab308',
        'VERMELHO': '#ef4444'
    }[inscricao.corCracha] || '#6366f1';

    // ================= FRENTE (LADO DIREITO) =================
    const fX = middleX;
    const fY = y;

    // Fundo branco
    doc.rect(fX, fY, CARD_WIDTH, CARD_HEIGHT).fill('#ffffff');

    // Faixa lateral colorida (5mm)
    const stripeWidth = mmToPt(5);
    doc.rect(fX, fY, stripeWidth, CARD_HEIGHT).fill(corFaixa);

    // Área útil centralizada (descontando faixa)
    const contentStartX = fX + stripeWidth;
    const contentWidth = CARD_WIDTH - stripeWidth;

    // LOGO EJC
    // Centralizar imagem
    const logoY = fY + mmToPt(8);
    const logoSize = mmToPt(16); // 16mm (~45pt)

    try {
        const logoX = contentStartX + (contentWidth - logoSize) / 2;
        doc.image(LOGO_PATH, logoX, logoY, { width: logoSize, height: logoSize, fit: [logoSize, logoSize], align: 'center' });
    } catch (err) {
        // Fallback se imagem falhar: Circulo
        doc.circle(contentStartX + (contentWidth / 2), logoY + (logoSize / 2), logoSize / 2)
            .fillAndStroke('#6366f1', '#5558d9');
        doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold')
            .text('EJC', contentStartX, logoY + mmToPt(5), { width: contentWidth, align: 'center' });
    }

    // Nome (Ajustado para tamanho pequeno)
    const nome = inscricao.apelido || inscricao.nomeCompleto1 || 'Nome';
    // Reduzir tamanho se nome for muito grande
    const nomeSize = nome.length > 20 ? 10 : 12;
    doc.fontSize(nomeSize).fillColor('#1f2937').font('Helvetica-Bold')
        .text(nome.toUpperCase(), contentStartX, fY + mmToPt(27), { width: contentWidth, align: 'center' });

    // Função com destaque
    if (inscricao.funcaoTrabalhador) {
        const funcaoTexto = inscricao.funcaoTrabalhador.toUpperCase();

        doc.fontSize(7).font('Helvetica-Bold');
        const textWidth = doc.widthOfString(funcaoTexto);
        const boxWidth = textWidth + mmToPt(6);
        const boxHeight = mmToPt(6);
        const boxX = contentStartX + (contentWidth - boxWidth) / 2;
        const boxY = fY + mmToPt(38);

        doc.roundedRect(boxX, boxY, boxWidth, boxHeight, mmToPt(2))
            .fill(corFaixa);

        doc.fillColor('#ffffff')
            .text(funcaoTexto, contentStartX, boxY + mmToPt(1.5), { width: contentWidth, align: 'center' });
    }

    // ================= VERSO (LADO ESQUERDO) =================
    const vX = x;
    const vY = y;

    // Fundo branco
    doc.rect(vX, vY, CARD_WIDTH, CARD_HEIGHT).fill('#ffffff');

    // Cabeçalho
    doc.fontSize(7).fillColor('#1f2937').font('Helvetica-Bold')
        .text('Encontro de Jovens com Cristo', vX, vY + mmToPt(8), { width: CARD_WIDTH, align: 'center' });
    doc.fontSize(5).fillColor('#6b7280').font('Helvetica')
        .text('XXIX EJC AUXILIADORA', vX, vY + mmToPt(12), { width: CARD_WIDTH, align: 'center' });

    // Dados
    const margin = mmToPt(4);
    const dataWidth = CARD_WIDTH - (margin * 2);

    doc.fontSize(5).fillColor('#6b7280').font('Helvetica-Bold')
        .text('NOME COMPLETO:', vX + margin, vY + mmToPt(20));
    doc.fontSize(6).fillColor('#1f2937').font('Helvetica')
        .text(inscricao.nomeCompleto || inscricao.nomeCompleto1 || 'Nome Completo', vX + margin, vY + mmToPt(23), { width: dataWidth, height: mmToPt(8), ellipsis: true });

    // Código
    const codeBoxWidth = mmToPt(30);
    const codeBoxHeight = mmToPt(8);
    const codeBoxX = vX + (CARD_WIDTH - codeBoxWidth) / 2;
    const codeBoxY = vY + mmToPt(34);

    doc.roundedRect(codeBoxX, codeBoxY, codeBoxWidth, codeBoxHeight, mmToPt(1))
        .fillAndStroke('#f3f4f6', '#d1d5db');

    doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold')
        .text(codigoCurto, vX, codeBoxY + mmToPt(2), { width: CARD_WIDTH, align: 'center' });

    // Rodapé
    doc.fontSize(4).fillColor('#9ca3af').font('Helvetica-Oblique')
        .text('Pessoal e Intransferível', vX, vY + mmToPt(48), { width: CARD_WIDTH, align: 'center' });

    // Linha de dobra (tracejada no meio)
    doc.moveTo(middleX, y).lineTo(middleX, y + CARD_HEIGHT)
        .dash(3, { space: 3 })
        .stroke('#e5e7eb');

    // Borda externa total
    doc.rect(x, y, FULL_WIDTH, CARD_HEIGHT).undash().stroke('#e5e7eb');
};

// Gerar PDF do crachá individual
export const gerarCrachaPDF = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { tipo } = req.query;

        let inscricao;
        const { getById } = await import('./inscricoes.controller.js');

        // Check case insensitive manual
        if (tipo && tipo.toUpperCase() === 'TRABALHADOR') {
            inscricao = await prisma.inscricaoTrabalhador.findUnique({ where: { id } });
        } else {
            inscricao = await prisma.inscricaoParticipante.findUnique({ where: { id } });
            if (!inscricao) {
                inscricao = await prisma.inscricaoTrabalhador.findUnique({ where: { id } });
            }
        }

        if (!inscricao) {
            return res.status(404).json({ error: 'Inscrição não encontrada' });
        }

        // A4 Portrait
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'portrait',
            margins: { top: 0, bottom: 0, left: 0, right: 0 }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=cracha_${inscricao.codigoVerificacao}.pdf`);
        doc.pipe(res);

        // Centralizar na folha A4 (595.28 x 841.89)
        const startX = (595.28 - FULL_WIDTH) / 2;
        const startY = (841.89 - CARD_HEIGHT) / 2;

        desenharCracha(doc, inscricao, startX, startY);

        doc.end();
    } catch (error) {
        next(error);
    }
};

// Gerar PDF de múltiplos crachás (LOTE)
export const gerarCrachasEmLote = async (req, res, next) => {
    try {
        const { ids, tipo } = req.body;

        if (!ids || ids.length === 0) {
            return res.status(400).json({ error: 'Nenhuma inscrição selecionada' });
        }

        let inscricoes;
        if (tipo && tipo.toUpperCase() === 'TRABALHADOR') {
            inscricoes = await prisma.inscricaoTrabalhador.findMany({ where: { id: { in: ids } } });
        } else {
            inscricoes = await prisma.inscricaoParticipante.findMany({ where: { id: { in: ids } } });
        }

        // A4 Portrait (595.28 x 841.89)
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'portrait',
            margins: { top: 10, bottom: 10, left: 10, right: 10 }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=crachas_lote.pdf`);
        doc.pipe(res);

        // Estratégia "Compacta": Gap 0 para corte único
        const marginX = (595.28 - FULL_WIDTH) / 2;
        const itemsPerPage = 5;

        // Altura total usada: 5 * 153.02 = 765.1 pt
        // Altura A4: 841.89 pt
        // Sobra: 76.79 pt => ~38 pt margem top/bottom
        const totalContentHeight = itemsPerPage * CARD_HEIGHT;
        const startY = (841.89 - totalContentHeight) / 2;

        const gapY = 0; // ZERO GAP para economizar espaço e facilitar corte

        let count = 0;
        let pageCount = 0;

        for (const inscricao of inscricoes) {
            if (count > 0 && count % itemsPerPage === 0) {
                doc.addPage();
                pageCount = 0;
            }

            const y = startY + (pageCount * (CARD_HEIGHT + gapY));

            desenharCracha(doc, inscricao, marginX, y);

            // Linha de corte horizontal (apenas embaixo se não for o último, ou entre eles)
            // Como gap é 0, a borda inferior de um é a superior do outro.
            // A função desenharCracha já desenha borda.

            count++;
            pageCount++;
        }

        doc.end();
    } catch (error) {
        next(error);
    }
};

export const atualizarCorFuncao = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { corCracha, funcaoTrabalhador, apelido } = req.body;

        const inscricao = await prisma.inscricaoTrabalhador.update({
            where: { id },
            data: { corCracha, funcaoTrabalhador, apelido },
        });

        res.json(inscricao);
    } catch (error) {
        next(error);
    }
};

export const listarPorFuncao = async (req, res, next) => {
    try {
        const funcoes = [
            'Equipe dirigente', 'Coordenação Geral', 'Boa Vontade', 'Banda',
            'Apresentadores', 'Sociodrama', 'Som & Iluminação', 'Liturgia & Vigília',
            'Externa', 'Secretaria', 'Círculos', 'Tráfego, Correios e Compras',
            'Lanchinho', 'Cozinha', 'Minibox', 'Ordem', 'Trânsito & Recepção'
        ];

        const resultado = {};

        for (const funcao of funcoes) {
            const trabalhadores = await prisma.inscricaoTrabalhador.findMany({
                where: { funcaoTrabalhador: funcao, status: 'APROVADA' },
                select: { id: true, nomeCompleto1: true, nomeCompleto2: true, email: true, contato1: true, corCracha: true, codigoVerificacao: true },
            });
            resultado[funcao] = { total: trabalhadores.length, trabalhadores };
        }

        const semFuncao = await prisma.inscricaoTrabalhador.findMany({
            where: { funcaoTrabalhador: null, status: 'APROVADA' },
            select: { id: true, nomeCompleto1: true, nomeCompleto2: true, email: true, contato1: true, corCracha: true, codigoVerificacao: true },
        });
        resultado['Sem Função Atribuída'] = { total: semFuncao.length, trabalhadores: semFuncao };

        res.json(resultado);
    } catch (error) {
        next(error);
    }
};
