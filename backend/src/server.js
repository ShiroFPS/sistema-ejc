import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { config } from './config/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Rotas
import authRoutes from './routes/auth.routes.js';
import inscricoesRoutes from './routes/inscricoes.routes.js';
import configRoutes from './routes/config.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import exportRoutes from './routes/export.routes.js';
import trabalhadoresRoutes from './routes/trabalhadores.routes.js';
import crachaRoutes from './routes/cracha.routes.js';

const app = express();

// Middlewares
app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
}));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/inscricoes', inscricoesRoutes);
app.use('/api/config', configRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/inscricoes/trabalhadores', trabalhadoresRoutes);
app.use('/api/cracha', crachaRoutes);

// Error handler
app.use(errorHandler);

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 Frontend permitido: ${config.frontendUrl}`);
});

export default app;
