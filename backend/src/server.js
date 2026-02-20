import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Rotas
import authRoutes from './routes/auth.routes.js';
import inscricoesRoutes from './routes/inscricoes.routes.js';
import configRoutes from './routes/config.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import exportRoutes from './routes/export.routes.js';
import importRoutes from './routes/import.routes.js';
import trabalhadoresRoutes from './routes/trabalhadores.routes.js';
import crachaRoutes from './routes/cracha.routes.js';
import qrcodeRoutes from './routes/qrcode.routes.js';

const app = express();

// Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "*"], // Permitir imagens de qualquer lugar
            connectSrc: ["'self'", "https:", "*"],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }, // PERMITIR CARREGAMENTO DE RECURSOS (IMAGENS) DE OUTROS ORIGENS
    crossOriginEmbedderPolicy: false,
}));

app.use(compression());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 200, // Aumentado para lidar com rajadas de tráfego do SPA
    message: 'Muitas requisições, tente novamente em breve',
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Aumentado ligeiramente para evitar falsos positivos
    message: 'Muitas tentativas de login, tente novamente mais tarde',
    skipSuccessfulRequests: true,
});

// Middlewares
const allowedOrigins = [
    config.frontendUrl,
    'http://localhost:5173',
    'https://ejc-auxiliadora.vercel.app',
    'https://sistema-ejc.vercel.app'
].filter(Boolean);

console.log('Allowed Origins:', allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            console.error('❌ BLOCKED CORS ORIGIN:', origin);
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
}));

// Aplicar rate limiting geral
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/auth/login', loginLimiter); // Rate limit específico para login
app.use('/api/auth', authRoutes);
app.use('/api/inscricoes', inscricoesRoutes);
app.use('/api/config', configRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/imports', importRoutes); // Nova rota de importação
app.use('/api/inscricoes/trabalhadores', trabalhadoresRoutes);
app.use('/api/cracha', crachaRoutes);
app.use('/api/qrcode', qrcodeRoutes);

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
    console.log(`🛡️  Rate limiting configurado`);
    console.log(`🔒 Security headers ativados`);
});

// Tratamento de erros globais para evitar queda do processo
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    // Em produção, talvez queiramos fechar o servidor graciosamente após erro fatal
    // mas no Render free tier, o processo reinicia automaticamente.
});

export default app;
