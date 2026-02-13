import express from 'express';
import { uploadFoto, uploadComprovante, getArquivo } from '../controllers/upload.controller.js';

const router = express.Router();

// Rotas públicas de upload
router.post('/foto', uploadFoto);
router.post('/comprovante', uploadComprovante);
router.get('/file/:id', getArquivo);

export default router;
