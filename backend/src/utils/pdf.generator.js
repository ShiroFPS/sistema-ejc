import PDFDocument from 'pdfkit';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export const gerarFichaEntrevista = async (inscricaoId) => {
    let inscricao = await prisma.inscricaoParticipante.findUnique({
        where: { id: inscricaoId },
    });

    if (!inscricao) {
        inscricao = await prisma.inscricaoTrabalhador.findUnique({
            where: { id: inscricaoId },
        });
        if (inscricao) inscricao.tipo = 'TRABALHADOR';
    } else {
        inscricao.tipo = 'PARTICIPANTE';
    }

    if (!inscricao) {
        throw new Error('Inscrição não encontrada');
    }

    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // CABEÇALHO
            doc.font('Helvetica-Bold').fontSize(16).text('FICHA DE ENTREVISTA - EJC', { align: 'center' });
            doc.moveDown(0.5);

            const displayTipo = inscricao.tipo === 'TRABALHADOR' ? 'ENCONTREIRO' : 'ENCONTRISTA';
            doc.font('Helvetica').fontSize(10).text(`Tipo: ${displayTipo}`, { align: 'center' });
            doc.moveDown(1);

            // Linha separadora
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(1);

            // Helper para adicionar seção
            const addSection = (title) => {
                doc.font('Helvetica-Bold').fontSize(11).text(title);
                doc.moveDown(0.3);
                doc.font('Helvetica').fontSize(9);
            };

            // Helper para adicionar campo
            const addField = (label, value) => {
                if (value) {
                    doc.text(`${label}: ${value}`, { width: 380 });
                }
            };

            // DADOS PESSOAIS
            // Tentar carregar a foto primeiro
            if (inscricao.fotoUrl) {
                try {
                    const response = await axios.get(inscricao.fotoUrl, { responseType: 'arraybuffer' });
                    const imageBuffer = Buffer.from(response.data, 'binary');
                    // Foto no canto superior direito (abaixo da linha separadora)
                    doc.image(imageBuffer, 450, 130, { width: 90, height: 120, fit: [90, 120] });
                } catch (error) {
                    console.error('Erro ao carregar foto para o PDF:', error.message);
                }
            }

            addSection('DADOS PESSOAIS');
            addField('Nome Completo', inscricao.nomeCompleto || inscricao.nomeCompleto1);
            addField('Apelido', inscricao.apelido);
            if (inscricao.dataNascimento) {
                addField('Data de Nascimento', new Date(inscricao.dataNascimento).toLocaleDateString('pt-BR'));
            }
            addField('Sexo', inscricao.sexo || inscricao.sexo1);
            addField('Telefone', inscricao.telefone || inscricao.contato1);
            addField('Instagram', inscricao.instagram || inscricao.instagram1);
            doc.moveDown(1);

            // CÓDIGO DE VERIFICAÇÃO + QR CODE
            addSection('CÓDIGO DE VERIFICAÇÃO');
            const codeY = doc.y;
            addField('Código', inscricao.codigoVerificacao);

            // QR Code abaixo da foto (foto em X=450, Y=130, height=120 -> Y=250)
            try {
                const qrBuffer = await QRCode.toBuffer(inscricao.codigoVerificacao, {
                    type: 'png',
                    width: 200,
                    margin: 1
                });
                doc.image(qrBuffer, 455, 255, { width: 80, height: 80 });
            } catch (err) {
                console.error('Erro ao gerar QR:', err);
            }

            doc.moveDown(1);

            // INFORMAÇÕES ADICIONAIS
            if (inscricao.estadoCivil) {
                addSection('INFORMAÇÕES ADICIONAIS');
                addField('Estado Civil', inscricao.estadoCivil);
                addField('Escolaridade', inscricao.escolaridade);
                addField('Profissão', inscricao.profissao);
                if (inscricao.trabalha) addField('Local de Trabalho', inscricao.localTrabalho);
                doc.moveDown(1);
            }

            // ENDEREÇO
            if (inscricao.enderecoCompleto) {
                addSection('ENDEREÇO');
                addField('Endereço', inscricao.enderecoCompleto);
                addField('Bairro', inscricao.bairro);
                addField('Mora com', inscricao.moraComQuem);
                doc.moveDown(1);
            }

            // DADOS DOS PAIS
            if (inscricao.nomeMae || inscricao.nomePai) {
                addSection('DADOS DOS PAIS');
                addField('Mãe', inscricao.nomeMae);
                addField('Telefone da Mãe', inscricao.telefoneMae);
                addField('Pai', inscricao.nomePai);
                addField('Telefone do Pai', inscricao.telefonePai);
                doc.moveDown(1);
            }

            // INFORMAÇÕES DE SAÚDE
            if (inscricao.restricoesAlimentares || inscricao.alergias || inscricao.problemasSaude) {
                addSection('INFORMAÇÕES DE SAÚDE');
                addField('Restrições Alimentares', inscricao.restricoesAlimentares);
                addField('Alergias', inscricao.alergias);
                addField('Problemas de Saúde', inscricao.problemasSaude);
                addField('Medicamentos Contínuos', inscricao.medicamentosContinuos);
                doc.moveDown(1);
            }

            // CONTATOS DE EMERGÊNCIA
            if (inscricao.contatosEmergencia) {
                try {
                    const contatos = JSON.parse(inscricao.contatosEmergencia);
                    if (contatos.length > 0) {
                        addSection('CONTATOS EXTRAS');
                        contatos.forEach((c, idx) => {
                            if (c.nome && c.telefone) {
                                doc.text(`${idx + 1}. ${c.nome} - Tel: ${c.telefone}`);
                            }
                        });
                        doc.moveDown(1);
                    }
                } catch (e) {
                    console.error('Erro ao parsear contatos:', e);
                }
            }

            // OBSERVAÇÕES
            addSection('OBSERVAÇÕES DA ENTREVISTA');
            doc.text('_'.repeat(80));
            doc.moveDown(0.5);
            doc.text('_'.repeat(80));
            doc.moveDown(0.5);
            doc.text('_'.repeat(80));

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
        if (filtros.corGrupo) where.corGrupo = filtros.corGrupo;

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

        const trabs = await prisma.inscricaoTrabalhador.findMany({ where });
        const trabsNormalized = trabs.map(t => ({
            ...t,
            tipo: 'TRABALHADOR',
            nomeCompleto: t.nomeCompleto1 || '',
        }));
        inscricoes = [...inscricoes, ...trabsNormalized];
    }

    inscricoes.sort((a, b) => (a.nomeCompleto || '').localeCompare(b.nomeCompleto || ''));

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        doc.font('Helvetica-Bold').fontSize(16).text('LISTA DE PRESENÇA - EJC', { align: 'center' });
        doc.moveDown(1);

        inscricoes.forEach((insc, idx) => {
            const nome = insc.nomeCompleto || insc.nomeCompleto1 || 'Sem nome';
            doc.font('Helvetica').fontSize(10).text(`${idx + 1}. ${nome} _________________________`);
            doc.moveDown(0.3);

            if ((idx + 1) % 25 === 0 && idx < inscricoes.length - 1) {
                doc.addPage();
            }
        });

        doc.end();
    });
};
