import express from 'express';
import QRCode from 'qrcode';
import { prisma } from '../utils/prisma.js';

const router = express.Router();

// Gerar QR Code para um participante ou trabalhador
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { tipo } = req.query; // PARTICIPANTE ou TRABALHADOR

        let inscricao;
        if (tipo === 'TRABALHADOR') {
            inscricao = await prisma.inscricaoTrabalhador.findUnique({ where: { id } });
        } else {
            inscricao = await prisma.inscricaoParticipante.findUnique({ where: { id } });
        }

        if (!inscricao) {
            return res.status(404).json({ error: 'Inscrição não encontrada' });
        }

        // Gerar QR code com o código de verificação
        const qrCodeData = inscricao.codigoVerificacao;

        // Gerar imagem PNG do QR code
        const qrCodeImage = await QRCode.toBuffer(qrCodeData, {
            type: 'png',
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        res.setHeader('Content-Type', 'image/png');
        res.send(qrCodeImage);
    } catch (error) {
        next(error);
    }
});

export default router;
