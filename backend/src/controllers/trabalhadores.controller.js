import { InscricaoService } from '../services/inscricao.service.js';
import { trabalhadorSchema } from '../schemas/inscricao.schema.js';
import { prisma } from '../utils/prisma.js';

// Criar inscrição de trabalhador
export const criarTrabalhador = async (req, res, next) => {
    try {
        const validatedData = trabalhadorSchema.parse(req.body);

        const inscricao = await InscricaoService.criarTrabalhador(validatedData);

        res.status(201).json(inscricao);
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        }
        next(error);
    }
};

// Listar trabalhadores (admin)
export const listarTrabalhadores = async (req, res, next) => {
    try {
        const { status, grupoFuncional, page = 1, limit = 20 } = req.query;

        const where = {};
        if (status) where.status = status;
        if (grupoFuncional) where.grupoFuncional = grupoFuncional;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [inscricoes, total] = await Promise.all([
            prisma.inscricaoTrabalhador.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' },
            }),
            prisma.inscricaoTrabalhador.count({ where }),
        ]);

        res.json({
            inscricoes,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        });
    } catch (error) {
        next(error);
    }
};

// Obter trabalhador por ID
export const obterTrabalhadorPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const inscricao = await prisma.inscricaoTrabalhador.findUnique({
            where: { id },
        });

        if (!inscricao) {
            return res.status(404).json({ error: 'Inscrição não encontrada' });
        }

        res.json(inscricao);
    } catch (error) {
        next(error);
    }
};

// Aprovar trabalhador
export const aprovarTrabalhador = async (req, res, next) => {
    try {
        const { id } = req.params;

        const inscricao = await prisma.inscricaoTrabalhador.update({
            where: { id },
            data: { status: 'APROVADA' },
        });

        res.json(inscricao);
    } catch (error) {
        next(error);
    }
};

// Rejeitar trabalhador
export const rejeitarTrabalhador = async (req, res, next) => {
    try {
        const { id } = req.params;

        const inscricao = await prisma.inscricaoTrabalhador.update({
            where: { id },
            data: { status: 'REJEITADA' },
        });

        res.json(inscricao);
    } catch (error) {
        next(error);
    }
};

// Buscar trabalhadores
export const buscarTrabalhadores = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.json({ inscricoes: [] });
        }

        const inscricoes = await prisma.inscricaoTrabalhador.findMany({
            where: {
                OR: [
                    { nomeCompleto1: { contains: query, mode: 'insensitive' } },
                    { nomeCompleto2: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: 50,
        });

        const normalized = inscricoes.map(t => ({
            ...t,
            tipo: 'TRABALHADOR',
            nomeCompleto: t.tipoInscricao === 'CASAIS_UNIAO_ESTAVEL'
                ? `${t.nomeCompleto1} & ${t.nomeCompleto2}`
                : t.nomeCompleto1,
            telefone: t.contato1,
        }));

        res.json({ inscricoes: normalized });
    } catch (error) {
        next(error);
    }
};
