import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar 3 usuários administrativos
    const senhaHash = await bcrypt.hash('ejc2024', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@ejc.com' },
        update: {},
        create: {
            nome: 'Administrador EJC',
            email: 'admin@ejc.com',
            senha: senhaHash,
            role: 'ADMIN',
        },
    });

    const coordenador1 = await prisma.user.upsert({
        where: { email: 'coordenador1@ejc.com' },
        update: {},
        create: {
            nome: 'Coordenador 1',
            email: 'coordenador1@ejc.com',
            senha: senhaHash,
            role: 'COORDENADOR',
        },
    });

    const coordenador2 = await prisma.user.upsert({
        where: { email: 'coordenador2@ejc.com' },
        update: {},
        create: {
            nome: 'Coordenador 2',
            email: 'coordenador2@ejc.com',
            senha: senhaHash,
            role: 'COORDENADOR',
        },
    });

    console.log('✅ Usuários criados:', { admin, coordenador1, coordenador2 });

    // Criar configuração inicial
    const config = await prisma.configuracao.upsert({
        where: { id: 1 },
        update: {},
        create: {
            limiteParticipantes: 100,
            limiteTrabalhadores: 100,
            dataLimiteInscricoes: '2026-12-31T23:59:59.000Z',
            coresPersonalizadas: JSON.stringify({
                primary: '#6366f1',
                secondary: '#8b5cf6',
            }),
            emailsNotificacao: JSON.stringify(['contato@ejc.com']),
        },
    });

    console.log('✅ Configuração criada:', config);

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📧 Credenciais de acesso:');
    console.log('  Admin: admin@ejc.com / ejc2024');
    console.log('  Coordenador 1: coordenador1@ejc.com / ejc2024');
    console.log('  Coordenador 2: coordenador2@ejc.com / ejc2024');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
