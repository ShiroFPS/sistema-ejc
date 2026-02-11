import PDFDocument from 'pdfkit';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export const gerarFichaEntrevista = async (inscricaoId) => {
    let inscricao = await prisma.inscricaoParticipante.findUnique({
        where: { id: inscricaoId },
    });
    let tipoInscricao = 'PARTICIPANTE';

    if (!inscricao) {
        inscricao = await prisma.inscricaoTrabalhador.findUnique({
            where: { id: inscricaoId },
        });
        tipoInscricao = 'TRABALHADOR';
    }

    if (!inscricao) {
        throw new Error('Inscrição não encontrada');
    }

    // Normalizar dados do trabalhador para o formato esperado pelo PDF
    if (tipoInscricao === 'TRABALHADOR') {
        inscricao.nomeCompleto = inscricao.tipoInscricao === 'CASAIS_UNIAO_ESTAVEL'
            ? `${inscricao.nomeCompleto1} & ${inscricao.nomeCompleto2 || ''}`
            : inscricao.nomeCompleto1;

        inscricao.apelido = inscricao.apelido || inscricao.apelido2 || ''; // Usa o primeiro ou o segundo
        inscricao.dataNascimento = inscricao.dataNascimento1 ? inscricao.dataNascimento1.toISOString() : new Date().toISOString(); // Fallback
        inscricao.sexo = inscricao.sexo1;
        inscricao.telefone = inscricao.contato1;
        inscricao.instagram = inscricao.instagram1;
        inscricao.profissao = inscricao.areaTrabalhoEstudo || 'Não informado';
        inscricao.trabalha = inscricao.trabalhamOuEstudam;
        // Campos que não existem no trabalhador ou são diferentes, definimos vazio ou adaptamos
        inscricao.escolaridade = '';
        inscricao.localTrabalho = '';
        inscricao.estadoCivil = inscricao.tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' ? 'CASADO/UNIÃO' : 'SOLTEIRO';
        inscricao.bairro = ''; // Trabalhador só tem enderecoCompleto
        inscricao.nomeMae = '';
        inscricao.nomePai = '';
        inscricao.telefoneMae = '';
        inscricao.telefonePai = '';
        inscricao.moraComQuem = '';
        inscricao.fotoUrl1 = inscricao.fotoUrl1;
        inscricao.fotoUrl2 = inscricao.fotoUrl2;
    }

    inscricao.tipo = tipoInscricao; // Adiciona o tipo para exibição

    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Cabeçalho
            doc.fontSize(18).text('FICHA DE ENTREVISTA - EJC', { align: 'center' });
            doc.moveDown();
            const displayTipo = inscricao.tipo === 'TRABALHADOR' ? 'ENCONTREIRO' : 'ENCONTRISTA';
            doc.fontSize(10).text(`Tipo: ${displayTipo}`, { align: 'center' });
            if (inscricao.grupoFuncional) {
                doc.text(`Grupo Funcional: ${inscricao.grupoFuncional}`, { align: 'center' });
            }
            doc.moveDown(2);

            // Foto(s) (se existir)
            let photoY = doc.y;
            const drawPhoto = async (url, xOffset) => {
                if (!url) return;
                try {
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    const imageBuffer = Buffer.from(response.data, 'binary');
                    doc.image(imageBuffer, xOffset, photoY, { width: 100, height: 100 });
                } catch (error) {
                    console.error('Erro ao carregar foto para PDF:', error.message);
                    doc.fontSize(8).text('(Erro ao carregar foto)', xOffset, photoY);
                }
            };

            if (inscricao.tipo === 'PARTICIPANTE' && inscricao.fotoUrl) {
                await drawPhoto(inscricao.fotoUrl, 450);
            } else if (inscricao.tipo === 'TRABALHADOR') {
                if (inscricao.fotoUrl1) await drawPhoto(inscricao.fotoUrl1, 450);
                if (inscricao.fotoUrl2) {
                    photoY += 110; // Espaço se houver segunda foto (raro em ID-1 mas possível em ficha)
                    // Ou melhor, lado a lado se couber? 450 e 340?
                    // Vamos deixar um abaixo do outro ou lado a lado.
                    // Na ficha de entrevista (A4), cabe lado a lado.
                    // Reset photoY for side-by-side:
                    photoY = doc.y;
                    await drawPhoto(inscricao.fotoUrl1, 460);
                    await drawPhoto(inscricao.fotoUrl2, 350);
                } else if (inscricao.fotoUrl1) {
                    // Ja desenhado acima
                }
            }

            // Re-fix the logic above to avoid drawing twice
            doc.y = photoY; // Reset doc.y to avoid overlap with text if photos are large
            if (inscricao.fotoUrl2) doc.moveDown(5); // Make space for the 100pt photos

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
            doc.moveDown(0.5);
            // Removidas linhas desorganizadas conforme solicitado

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export const gerarListaPresenca = async (filtros = {}) => {
    let inscricoes = [];

    // Buscar Participantes
    if (!filtros.tipo || filtros.tipo === 'PARTICIPANTE') {
        const where = {};
        if (filtros.status) where.status = filtros.status;
        if (filtros.corGrupo) where.corGrupo = filtros.corGrupo; // Suportar filtro de cor

        const parts = await prisma.inscricaoParticipante.findMany({
            where,
            orderBy: { nomeCompleto: 'asc' },
        });
        inscricoes = [...inscricoes, ...parts.map(p => ({ ...p, tipo: 'PARTICIPANTE' }))];
    }

    // Buscar Trabalhadores
    if (!filtros.tipo || filtros.tipo === 'TRABALHADOR') {
        const where = {};
        if (filtros.status) where.status = filtros.status;
        if (filtros.grupoFuncional) where.grupoFuncional = filtros.grupoFuncional;
        if (filtros.funcaoTrabalhador) where.funcaoTrabalhador = filtros.funcaoTrabalhador;

        const trabs = await prisma.inscricaoTrabalhador.findMany({
            where,
        }); // Trabalhadores precisam de normalização de nome para ordenação

        const trabsNormalized = trabs.map(t => ({
            ...t,
            tipo: 'TRABALHADOR',
            nomeCompleto: t.tipoInscricao === 'CASAIS_UNIAO_ESTAVEL'
                ? `${t.nomeCompleto1} & ${t.nomeCompleto2}`
                : t.nomeCompleto1,
            telefone: t.contato1
        }));

        inscricoes = [...inscricoes, ...trabsNormalized];
    }

    // Ordenar final por Nome
    inscricoes.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));

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
