import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    jwtSecret: (() => {
        if (!process.env.JWT_SECRET) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error('❌ JWT_SECRET must be defined in production');
            }
            console.warn('⚠️  Using default JWT_SECRET in development');
            return 'dev_secret_change_in_production';
        }
        return process.env.JWT_SECRET;
    })(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    email: {
        resendApiKey: process.env.RESEND_API_KEY,
        from: process.env.EMAIL_FROM || 'noreply@ejc.com',
    },
    whatsapp: {
        enabled: process.env.WHATSAPP_ENABLED === 'true',
    },
};
