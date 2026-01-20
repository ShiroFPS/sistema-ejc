import express from 'express';
import { obter, atualizar } from '../controllers/config.controller.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', obter);
router.put('/', authMiddleware, requireRole('ADMIN'), atualizar);

export default router;
