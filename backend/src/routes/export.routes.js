import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { gerarFichaEntrevista, gerarListaPresenca } from '../utils/pdf.generator.js';
import { gerarExcel } from '../utils/excel.generator.js';

const router = express.Router();

// Exportar para Excel
router.get('/excel', authMiddleware, async (req, res, next) => {
    try {
        const { tipo, status, grupoFuncional, agrupado } = req.query;

        const buffer = await gerarExcel({ tipo, status, grupoFuncional, agrupado });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=inscricoes_ejc_${Date.now()}.xlsx`);
        res.send(buffer);
    } catch (error) {
        next(error);
    }
});

// Ficha de entrevista (PDF)
router.get('/pdf/ficha/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        const buffer = await gerarFichaEntrevista(id);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ficha_entrevista_${id}.pdf`);
        res.send(buffer);
    } catch (error) {
        next(error);
    }
});

// Lista de presença (PDF)
router.get('/pdf/lista-presenca', authMiddleware, async (req, res, next) => {
    try {
        const { tipo, grupoFuncional, status } = req.query;

        const buffer = await gerarListaPresenca({ tipo, grupoFuncional, status });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=lista_presenca_ejc.pdf`);
        res.send(buffer);
    } catch (error) {
        next(error);
    }
});

export default router;
