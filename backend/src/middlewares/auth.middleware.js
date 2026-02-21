import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// Aliases para compatibilidade com rotas de e-commerce
export const verificarToken = authMiddleware;

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Sem permissão para esta ação' });
        }

        next();
    };
};

export const verificarAdmin = requireRole('ADMIN');
