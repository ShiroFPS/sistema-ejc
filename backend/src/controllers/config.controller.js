import { prisma } from '../utils/prisma.js';

// Obter configurações
export const obter = async (req, res, next) => {
    try {
        const config = await prisma.configuracao.findUnique({
            where: { id: 1 },
        });

        if (!config) {
            return res.status(404).json({ error: 'Configuração não encontrada' });
        }

        // Contar inscritos ativos (PENDENTE + APROVADA)
        const [totalParticipantes, totalTrabalhadoresRes] = await Promise.all([
            prisma.inscricaoParticipante.count({
                where: { status: { not: 'REJEITADA' } }
            }),
            prisma.inscricaoTrabalhador.count({
                where: { status: { not: 'REJEITADA' } }
            })
        ]);

        // Parsear JSONs e adicionar totais
        const configFormatada = {
            ...config,
            coresPersonalizadas: JSON.parse(config.coresPersonalizadas || '{}'),
            emailsNotificacao: JSON.parse(config.emailsNotificacao || '[]'),
            totalParticipantes,
            totalTrabalhadores: totalTrabalhadoresRes,
        };

        res.json(configFormatada);
    } catch (error) {
        next(error);
    }
};

// Atualizar configurações (apenas ADMIN)
export const atualizar = async (req, res, next) => {
    try {
        const data = req.body;

        const config = await prisma.configuracao.update({
            where: { id: 1 },
            data: {
                limiteParticipantes: Number(data.limiteParticipantes),
                limiteTrabalhadores: Number(data.limiteTrabalhadores),
                dataLimiteInscricoes: data.dataLimiteInscricoes ? new Date(data.dataLimiteInscricoes).toISOString() : null,
                coresPersonalizadas: data.coresPersonalizadas ? (typeof data.coresPersonalizadas === 'string' ? data.coresPersonalizadas : JSON.stringify(data.coresPersonalizadas)) : undefined,
                emailsNotificacao: data.emailsNotificacao ? (typeof data.emailsNotificacao === 'string' ? data.emailsNotificacao : JSON.stringify(data.emailsNotificacao)) : undefined,
            },
        });

        res.json(config);
    } catch (error) {
        next(error);
    }
};
