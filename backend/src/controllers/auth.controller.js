import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { prisma } from '../utils/prisma.js';

export const login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('❌ Login failed: User not found:', email);
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            console.log('❌ Login failed: Invalid password for:', email);
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        // Gerar token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const me = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};
