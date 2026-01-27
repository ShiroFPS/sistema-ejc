import { InscricaoService } from '../services/inscricao.service.js';
import { participanteSchema } from '../schemas/inscricao.schema.js';
import { prisma } from '../utils/prisma.js';

// Criar inscrição (participante)
export const criar = async (req, res, next) => {
    try {
        const validatedData = participanteSchema.parse(req.body);

        // Verificar limites e data limite
        const config = await prisma.configuracao.findUnique({ where: { id: 1 } });
        if (config.dataLimiteInscricoes && new Date() > new Date(config.dataLimiteInscricoes)) {
            return res.status(400).json({ error: 'Prazo de inscrições encerrado' });
        }

        const count = await prisma.inscricaoParticipante.count();
        if (count >= config.limiteParticipantes) {
            return res.status(400).json({ error: 'Limite de vagas para participantes atingido' });
        }

        const inscricao = await InscricaoService.criarParticipante(validatedData);

        res.status(201).json(inscricao);
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        }
        next(error);
    }
};

// Verificar CPF ou Nome (público)
export const verificarCpf = async (req, res, next) => {
    try {
        const { cpf, nome, tipo } = req.query;

        if (!cpf && !nome) return res.status(400).json({ error: 'Identificador não informado' });

        let existe = false;
        let dados = null;

        const where = { OR: [] };
        if (cpf) {
            if (tipo === 'TRABALHADOR') {
                where.OR.push({ cpf1: cpf }, { cpf2: cpf });
            } else {
                where.OR.push({ cpf: cpf });
            }
        }
        if (nome) {
            if (tipo === 'TRABALHADOR') {
                where.OR.push(
                    { nomeCompleto1: { equals: nome, mode: 'insensitive' } },
                    { nomeCompleto2: { equals: nome, mode: 'insensitive' } }
                );
            } else {
                where.OR.push({ nomeCompleto: { equals: nome, mode: 'insensitive' } });
            }
        }

        if (tipo === 'TRABALHADOR') {
            const t = await prisma.inscricaoTrabalhador.findFirst({ where });
            if (t) {
                existe = true;
                dados = { nome: t.nomeCompleto1, status: t.status };
            }
        } else {
            const p = await prisma.inscricaoParticipante.findFirst({ where });
            if (p) {
                existe = true;
                dados = { nome: p.nomeCompleto, status: p.status };
            }
        }

        res.json({ existe, dados });
    } catch (error) {
        next(error);
    }
};

// Listar inscrições combinadas (admin)
export const listar = async (req, res, next) => {
    try {
        const { tipo, status, grupoFuncional, page = 1, limit = 20 } = req.query;

        const where = {};
        if (status) where.status = status;
        if (grupoFuncional) where.grupoFuncional = grupoFuncional;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        let inscricoes = [];
        let total = 0;

        if (!tipo || tipo === 'PARTICIPANTE') {
            const participantes = await prisma.inscricaoParticipante.findMany({
                where: status ? { status } : {},
                skip: !tipo ? skip : 0,
                take: !tipo ? Math.ceil(parseInt(limit) / 2) : parseInt(limit),
                orderBy: { createdAt: 'desc' },
            });
            inscricoes = [...inscricoes, ...participantes.map(p => ({ ...p, tipo: 'PARTICIPANTE' }))];
            total += await prisma.inscricaoParticipante.count({ where: status ? { status } : {} });
        }

        if (!tipo || tipo === 'TRABALHADOR') {
            const trabalhadoresWhere = {};
            if (status) trabalhadoresWhere.status = status;
            if (grupoFuncional) trabalhadoresWhere.grupoFuncional = grupoFuncional;

            const trabalhadores = await prisma.inscricaoTrabalhador.findMany({
                where: trabalhadoresWhere,
                skip: !tipo ? skip : 0,
                take: !tipo ? Math.ceil(parseInt(limit) / 2) : parseInt(limit),
                orderBy: { createdAt: 'desc' },
            });
            inscricoes = [...inscricoes, ...trabalhadores.map(t => ({
                ...t,
                tipo: 'TRABALHADOR',
                nomeCompleto: t.tipoInscricao === 'CASAIS_UNIAO_ESTAVEL'
                    ? `${t.nomeCompleto1} & ${t.nomeCompleto2}`
                    : t.nomeCompleto1,
                telefone: t.contato1,
            }))];
            total += await prisma.inscricaoTrabalhador.count({ where: trabalhadoresWhere });
        }

        // Ordenar por data
        inscricoes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            inscricoes: inscricoes.slice(0, parseInt(limit)),
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        });
    } catch (error) {
        next(error);
    }
};

// Estatísticas (admin)
export const estatisticas = async (req, res, next) => {
    try {
        const [
            totalParticipantes,
            totalTrabalhadores,
            pendentesP,
            pendentesT,
            aprovadasP,
            aprovadasT,
            config,
        ] = await Promise.all([
            prisma.inscricaoParticipante.count(),
            prisma.inscricaoTrabalhador.count(),
            prisma.inscricaoParticipante.count({ where: { status: 'PENDENTE' } }),
            prisma.inscricaoTrabalhador.count({ where: { status: 'PENDENTE' } }),
            prisma.inscricaoParticipante.count({ where: { status: 'APROVADA' } }),
            prisma.inscricaoTrabalhador.count({ where: { status: 'APROVADA' } }),
            prisma.configuracao.findUnique({ where: { id: 1 } }),
        ]);

        res.json({
            totalParticipantes,
            totalTrabalhadores,
            pendentes: pendentesP + pendentesT,
            aprovadas: aprovadasP + aprovadasT,
            vagasRestantesParticipantes: config.limiteParticipantes - totalParticipantes,
            vagasRestantesTrabalhadores: config.limiteTrabalhadores - totalTrabalhadores,
        });
    } catch (error) {
        next(error);
    }
};

// Aprovar inscrição
export const aprovar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { tipo } = req.query;

        let inscricao;
        if (tipo === 'TRABALHADOR') {
            inscricao = await prisma.inscricaoTrabalhador.update({
                where: { id },
                data: { status: 'APROVADA' },
            });
        } else {
            inscricao = await prisma.inscricaoParticipante.update({
                where: { id },
                data: { status: 'APROVADA' },
            });
        }

        res.json(inscricao);
    } catch (error) {
        next(error);
    }
};

// Rejeitar inscrição
export const rejeitar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { tipo } = req.query;

        let inscricao;
        if (tipo === 'TRABALHADOR') {
            inscricao = await prisma.inscricaoTrabalhador.update({
                where: { id },
                data: { status: 'REJEITADA' },
            });
        } else {
            inscricao = await prisma.inscricaoParticipante.update({
                where: { id },
                data: { status: 'REJEITADA' },
            });
        }

        res.json(inscricao);
    } catch (error) {
        next(error);
    }
};

// Obter inscrição por ID
export const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { tipo } = req.query;

        let inscricao;
        // Check case insensitive para garantir
        if (tipo && tipo.toUpperCase() === 'TRABALHADOR') {
            inscricao = await prisma.inscricaoTrabalhador.findUnique({ where: { id } });
        } else {
            // Se não for explicitamente trabalhador, busca em participante 
            // OU tenta buscar em ambos se tipo não for fornecido?
            // O frontend manda ?tipo=trabalhador, então vamos confiar nisso.
            // Mas para segurança, se não achar em um, podia tentar no outro, mas vamos seguir o padrão.
            if (tipo && tipo.toUpperCase() === 'PARTICIPANTE') {
                inscricao = await prisma.inscricaoParticipante.findUnique({ where: { id } });
            } else {
                // Fallback ou busca genérica se não vier tipo
                inscricao = await prisma.inscricaoParticipante.findUnique({ where: { id } });
                if (!inscricao) {
                    inscricao = await prisma.inscricaoTrabalhador.findUnique({ where: { id } });
                }
            }
        }

        if (!inscricao) {
            return res.status(404).json({ error: 'Inscrição não encontrada' });
        }

        res.json(inscricao);
    } catch (error) {
        next(error);
    }
};
// Atualizar inscrição
export const atualizar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { tipo } = req.query;
        const data = req.body;

        let inscricao;
        if (tipo === 'TRABALHADOR') {
            // Limpar campos de data
            if (data.dataNascimento1 && typeof data.dataNascimento1 === 'string') data.dataNascimento1 = new Date(data.dataNascimento1);
            if (data.dataNascimento2 && typeof data.dataNascimento2 === 'string') data.dataNascimento2 = new Date(data.dataNascimento2);

            inscricao = await prisma.inscricaoTrabalhador.update({
                where: { id },
                data: data,
            });
        } else {
            inscricao = await prisma.inscricaoParticipante.update({
                where: { id },
                data: data,
            });
        }

        res.json(inscricao);
    } catch (error) {
        next(error);
    }
};
// Buscar inscrições (admin)
export const buscar = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.json({ inscricoes: [] });
        }

        const [participantes, trabalhadores] = await Promise.all([
            prisma.inscricaoParticipante.findMany({
                where: {
                    OR: [
                        { nomeCompleto: { contains: query } },
                        { apelido: { contains: query } },
                        { cpf: { contains: query } },
                        { email: { contains: query } },
                    ],
                },
                take: 50,
            }),
            prisma.inscricaoTrabalhador.findMany({
                where: {
                    OR: [
                        { nomeCompleto1: { contains: query } },
                        { nomeCompleto2: { contains: query } },
                        { email: { contains: query } },
                        { cpf1: { contains: query } },
                        { cpf2: { contains: query } },
                    ],
                },
                take: 50,
            }),
        ]);

        const total = [
            ...participantes.map(p => ({ ...p, tipo: 'PARTICIPANTE' })),
            ...trabalhadores.map(t => ({
                ...t,
                tipo: 'TRABALHADOR',
                nomeCompleto: t.tipoInscricao === 'CASAIS_UNIAO_ESTAVEL'
                    ? `${t.nomeCompleto1} & ${t.nomeCompleto2}`
                    : t.nomeCompleto1,
                telefone: t.contato1,
            })),
        ];

        // Ordenar por data
        total.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ inscricoes: total.slice(0, 50) });
    } catch (error) {
        next(error);
    }
};
