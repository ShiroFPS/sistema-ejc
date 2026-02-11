#!/usr/bin/env node

/**
 * Script para verificar status do deploy no Render
 * Uso: node check-deploy.js
 */

const https = require('https');

const BACKEND_URL = 'https://sistema-ejc-backend.onrender.com';
const CHECK_INTERVAL = 5000; // 5 segundos
const MAX_ATTEMPTS = 60; // 5 minutos máximo

let attempts = 0;

function checkHealth() {
    return new Promise((resolve, reject) => {
        https.get(`${BACKEND_URL}/health`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        }).on('error', () => resolve(false));
    });
}

async function monitorDeploy() {
    console.log('🚀 Verificando status do deploy no Render...\n');

    const startTime = Date.now();

    while (attempts < MAX_ATTEMPTS) {
        attempts++;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);

        process.stdout.write(`\r⏳ Tentativa ${attempts}/${MAX_ATTEMPTS} (${elapsed}s)...`);

        const isOnline = await checkHealth();

        if (isOnline) {
            console.log('\n\n✅ Deploy concluído! Backend está online.');
            console.log(`⏱️  Tempo total: ${elapsed} segundos`);
            console.log(`🔗 URL: ${BACKEND_URL}`);
            process.exit(0);
        }

        await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    }

    console.log('\n\n⚠️  Timeout: Deploy ainda não concluído após 5 minutos.');
    console.log('Verifique manualmente: https://dashboard.render.com');
    process.exit(1);
}

monitorDeploy();
