import express from 'express';
import {
    criarTrabalhador,
    listarTrabalhadores,
    obterTrabalhadorPorId,
    aprovarTrabalhador,
    rejeitarTrabalhador,
    buscarTrabalhadores,
} from '../controllers/trabalhadores.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rota pública
router.post('/', criarTrabalhador);

// Rotas protegidas
router.get('/', authMiddleware, listarTrabalhadores);
router.get('/buscar', authMiddleware, buscarTrabalhadores);
router.get('/:id', authMiddleware, obterTrabalhadorPorId);
router.patch('/:id/aprovar', authMiddleware, aprovarTrabalhador);
router.patch('/:id/rejeitar', authMiddleware, rejeitarTrabalhador);

export default router;
