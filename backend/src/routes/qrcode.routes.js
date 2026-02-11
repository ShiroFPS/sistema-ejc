import express from 'express';
import QRCode from 'qrcode';
import { prisma } from '../utils/prisma.js';

const router = express.Router();

// Gerar QR Code para um participante ou trabalhador
router.get('/:id', async (req, res, next) => {
    try {
        // Set CORS headers FIRST
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        const { id } = req.params;
        const { tipo } = req.query;

        let inscricao;
        if (tipo === 'TRABALHADOR') {
            inscricao = await prisma.inscricaoTrabalhador.findUnique({ where: { id } });
        } else {
            inscricao = await prisma.inscricaoParticipante.findUnique({ where: { id } });
        }

        if (!inscricao) {
            return res.status(404).json({ error: 'Inscrição não encontrada' });
        }

        const qrCodeImage = await QRCode.toBuffer(inscricao.codigoVerificacao, {
            type: 'png',
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(qrCodeImage);
    } catch (error) {
        next(error);
    }
});

export default router;
