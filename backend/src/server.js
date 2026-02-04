import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
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

// Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requests por IP
    message: 'Muitas requisições, tente novamente mais tarde',
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 tentativas de login
    message: 'Muitas tentativas de login, tente novamente mais tarde',
    skipSuccessfulRequests: true,
});

// Middlewares
const allowedOrigins = [
    config.frontendUrl,
    'http://localhost:5173',
    'https://ejc-auxiliadora.vercel.app',
    'https://sistema-ejc.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
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
    console.log(`🛡️  Rate limiting ativado`);
    console.log(`🔒 Security headers ativados`);
});

export default app;
