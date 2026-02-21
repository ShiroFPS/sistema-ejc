import { prisma } from '../utils/prisma.js';
import { sendWelcomeEmail } from './email.service.js';
import { generateShortCode } from '../utils/helpers.js';

export class InscricaoService {
    /**
     * Verifica se já existe uma inscrição pelo CPF ou Nome
     */
    static async verificarDuplicata(dados, tipo) {
        const { cpf, cpf1, cpf2, nomeCompleto, nomeCompleto1 } = dados;

        const where = { OR: [] };

        if (tipo === 'PARTICIPANTE') {
            if (cpf) where.OR.push({ cpf });
            if (nomeCompleto) where.OR.push({ nomeCompleto: nomeCompleto });

            const p = await prisma.inscricaoParticipante.findFirst({ where });
            if (p) return { existe: true, nome: p.nomeCompleto, status: p.status };
        } else {
            if (cpf1) where.OR.push({ cpf1 }, { cpf2: cpf1 });
            if (cpf2) where.OR.push({ cpf1: cpf2 }, { cpf2: cpf2 });
            if (nomeCompleto1) where.OR.push({ nomeCompleto1: nomeCompleto1 });

            const t = await prisma.inscricaoTrabalhador.findFirst({ where });
            if (t) return { existe: true, nome: t.nomeCompleto1, status: t.status };
        }

        return { existe: false };
    }

    static async criarParticipante(dados) {
        const duplicata = await this.verificarDuplicata({
            cpf: dados.cpf,
            nomeCompleto: dados.nomeCompleto
        }, 'PARTICIPANTE');

        if (duplicata.existe) {
            throw new Error(`Inscrição já existe para este CPF ou Nome (${duplicata.nome})`);
        }

        const inscricao = await prisma.inscricaoParticipante.create({
            data: {
                ...dados,
                codigoVerificacao: generateShortCode(8),
                status: dados.status || 'PENDENTE',
            },
        });

        if (inscricao.receberEmail && inscricao.email) {
            sendWelcomeEmail(inscricao.nomeCompleto, inscricao.email, 'PARTICIPANTE').catch(err => console.error('Email error:', err));
        }

        return inscricao;
    }

    static async criarTrabalhador(dados) {
        const duplicata = await this.verificarDuplicata({
            cpf1: dados.cpf1,
            cpf2: dados.cpf2,
            nomeCompleto1: dados.nomeCompleto1
        }, 'TRABALHADOR');

        if (duplicata.existe) {
            throw new Error(`Inscrição já existe para este CPF ou Nome (${duplicata.nome})`);
        }

        const finalData = { ...dados };
        if (dados.dataNascimento1) finalData.dataNascimento1 = new Date(dados.dataNascimento1);
        if (dados.dataNascimento2) finalData.dataNascimento2 = new Date(dados.dataNascimento2);

        const inscricao = await prisma.inscricaoTrabalhador.create({
            data: {
                ...finalData,
                codigoVerificacao: generateShortCode(8),
                status: finalData.status || 'PENDENTE',
            },
        });

        if (inscricao.receberEmail && inscricao.email) {
            sendWelcomeEmail(inscricao.nomeCompleto1, inscricao.email, 'TRABALHADOR').catch(err => console.error('Email error:', err));
        }

        return inscricao;
    }
}
