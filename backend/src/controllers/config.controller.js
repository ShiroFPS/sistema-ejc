import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obter configurações
export const obter = async (req, res, next) => {
    try {
        const config = await prisma.configuracao.findUnique({
            where: { id: 1 },
        });

        if (!config) {
            return res.status(404).json({ error: 'Configuração não encontrada' });
        }

        // Parsear JSONs
        const configFormatada = {
            ...config,
            coresPersonalizadas: JSON.parse(config.coresPersonalizadas || '{}'),
            emailsNotificacao: JSON.parse(config.emailsNotificacao || '[]'),
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
                limiteParticipantes: data.limiteParticipantes,
                limiteTrabalhadores: data.limiteTrabalhadores,
                dataLimiteInscricoes: data.dataLimiteInscricoes ? new Date(data.dataLimiteInscricoes) : null,
                coresPersonalizadas: data.coresPersonalizadas ? JSON.stringify(data.coresPersonalizadas) : undefined,
                emailsNotificacao: data.emailsNotificacao ? JSON.stringify(data.emailsNotificacao) : undefined,
            },
        });

        res.json(config);
    } catch (error) {
        next(error);
    }
};
