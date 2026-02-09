import express from 'express';
import { importWorkers } from '../controllers/import.controller.js';

const router = express.Router();

router.post('/workers', importWorkers);

export default router;
