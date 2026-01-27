import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

// Para desenvolvimento, se não houver SMTP configurado, logamos no console
const isDev = !process.env.SMTP_HOST;

const transporter = !isDev ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
}) : null;

export const sendEmail = async ({ to, subject, html }) => {
    try {
        if (isDev) {
            console.log('📧 [DEV EMAIL LOG]');
            console.log('To:', to);
            console.log('Subject:', subject);
            console.log('Content:', html);
            return { success: true, messageId: 'dev-mode' };
        }

        const info = await transporter.sendMail({
            from: config.email.from,
            to,
            subject,
            html,
        });

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Erro ao enviar e-mail:', error);
        return { success: false, error: error.message };
    }
};

export const sendWelcomeEmail = async (nome, email, tipo) => {
    const subject = `Inscrição Recebida - EJC Auxiliadora`;
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #6366f1;">Olá, ${nome}!</h2>
            <p>Recebemos com alegria sua inscrição para o XXIX EJC Auxiliadora como <strong>${tipo}</strong>.</p>
            <p>Seus dados foram registrados com sucesso em nossa base de dados.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #374151;">Status Atual: PENDENTE</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">Aguarde o contato da nossa equipe para confirmação e próximos passos.</p>
            </div>
            <p>Fique atento ao seu telefone e e-mail.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;">
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">Email automático enviado pelo Sistema EJC.</p>
        </div>
    `;

    return sendEmail({ to: email, subject, html });
};
