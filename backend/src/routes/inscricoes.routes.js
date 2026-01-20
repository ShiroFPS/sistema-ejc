import express from 'express';
import {
    listar,
    estatisticas,
    aprovar,
    rejeitar,
    getById,
} from '../controllers/inscricoes.controller.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rotas protegidas (admin e coordenador)
router.get('/', authMiddleware, listar);
router.get('/estatisticas', authMiddleware, estatisticas);
router.get('/:id', authMiddleware, getById);
router.patch('/:id/aprovar', authMiddleware, aprovar);
router.patch('/:id/rejeitar', authMiddleware, rejeitar);

export default router;
