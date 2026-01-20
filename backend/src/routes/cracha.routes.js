import express from 'express';
import {
    gerarCrachaPDF,
    gerarCrachasEmLote,
    atualizarCorFuncao,
    listarPorFuncao,
} from '../controllers/cracha.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rotas protegidas (apenas admin)
router.get('/gerar/:id', authMiddleware, gerarCrachaPDF);
router.post('/gerar-lote', authMiddleware, gerarCrachasEmLote);
router.put('/:id/atualizar', authMiddleware, atualizarCorFuncao);
router.get('/por-funcao', authMiddleware, listarPorFuncao);

export default router;
