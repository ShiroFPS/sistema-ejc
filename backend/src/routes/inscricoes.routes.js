import express from 'express';
import {
    listar,
    estatisticas,
    aprovar,
    rejeitar,
    getById,
    atualizar,
    criar,
    verificarCpf,
    buscar,
    excluir,
} from '../controllers/inscricoes.controller.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rotas Públicas
router.post('/', criar);
router.get('/verificar-cpf', verificarCpf);

// Rotas protegidas (admin e coordenador)
router.get('/buscar', authMiddleware, buscar);
router.get('/', authMiddleware, listar);
router.get('/estatisticas', authMiddleware, estatisticas);
router.get('/:id', authMiddleware, getById);
router.put('/:id', authMiddleware, atualizar);
router.patch('/:id/aprovar', authMiddleware, aprovar);
router.patch('/:id/rejeitar', authMiddleware, rejeitar);
router.delete('/:id', authMiddleware, excluir);

export default router;
