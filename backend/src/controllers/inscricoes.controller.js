import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
            inscricoes = [...inscricoes, ...trabalhadores.map(t => ({ ...t, tipo: 'TRABALHADOR' }))];
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
