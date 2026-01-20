import express from 'express';
import { uploadFoto, uploadComprovante } from '../controllers/upload.controller.js';

const router = express.Router();

// Rotas públicas de upload
router.post('/foto', uploadFoto);
router.post('/comprovante', uploadComprovante);

export default router;
