export const errorHandler = (err, req, res, next) => {
    console.error('❌ Erro:', err);

    // Erro de validação do Prisma
    if (err.code === 'P2002') {
        return res.status(400).json({
            error: 'Já existe um registro com esses dados',
            field: err.meta?.target,
        });
    }

    // Erro de validação do Zod
    if (err.name === 'ZodError') {
        return res.status(400).json({
            error: 'Dados inválidos',
            details: err.errors,
        });
    }

    // Erro padrão
    res.status(err.status || 500).json({
        error: err.message || 'Erro interno do servidor',
    });
};
