# Guia de Deploy Gratuito - Sistema EJC

Este guia explica como fazer deploy do Sistema de Inscrações EJC usando serviços gratuitos em nuvem.

## Visão Geral da Arquitetura

- **Backend**: Render.com (gratuito)
- **Frontend**: Vercel (gratuito)
- **Banco de Dados**: Neon PostgreSQL (gratuito, 500MB)
- **Arquivos**: Cloudinary (gratuito, 25GB)
- **Email**: Resend (gratuito, 3.000 emails/mês)

## 1. Banco de Dados - Neon PostgreSQL

**1.1. Criar conta:**
- Acesse: https://neon.tech
- Clique em "Sign Up" e crie sua conta

**1.2. Criar projeto:**
- Clique em "Create Project"
- Nome: EJC Sistema
- PostgreSQL version: Mais recente
- Region: Escolha mais próxima (ex: US East)

**1.3. Obter URL de conexão:**
- Após criar, copie a "Connection String"
- Formato: `postgresql://usuario:senha@ep-xxxx.us-east-2.aws.neon.tech/neondb`
- Guarde essa URL, será usada no backend

## 2. Upload de Arquivos - Cloudinary

**2.1. Criar conta:**
- Acesse: https://cloudinary.com
- Clique em "Sign Up Free"

**2.2. Obter credenciais:**
- No Dashboard, encontre:
  - **Cloud Name**
  - **API Key**
  - **API Secret**
- Guarde essas credenciais

## 3. Email - Resend

**3.1. Criar conta:**
- Acesse: https://resend.com
- Clique em "Sign Up"

**3.2. Obter API Key:**
- Vá em "API Keys"
- Clique em "Create API Key"
- Copie a chave (só aparece uma vez!)

## 4. Deploy do Backend - Render.com

**4.1. Criar conta no Render:**
- Acesse: https://render.com
- Clique em "Get Started" e crie sua conta com GitHub

**4.2. Fazer upload do código (se não usar Git):**

Crie um repositório no GitHub:
```bash
git init
git add .
git commit -m "Sistema EJC - Initial commit"
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

**4.3. Criar Web Service:**
- No Render Dashboard, clique em "New +"
- Selecione "Web Service"
- Conecte seu repositório GitHub
- Configure:
  - **Name**: ejc-backend
  - **Region**: Oregon (US West) - gratuito
  - **Branch**: main
  - **Root Directory**: backend
  - **Environment**: Node
  - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
  - **Start Command**: `npm start`
  - **Plan**: Free

**4.4. Adicionar variáveis de ambiente:**

Clique em "Environment" e adicione:

```
DATABASE_URL=<URL_DO_NEON_POSTGRESQL>
JWT_SECRET=<GERE_UMA_CHAVE_FORTE>
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=<SEU_CLOUD_NAME>
CLOUDINARY_API_KEY=<SUA_API_KEY>
CLOUDINARY_API_SECRET=<SEU_API_SECRET>
RESEND_API_KEY=<SUA_RESEND_API_KEY>
EMAIL_FROM=noreply@seudominio.com
FRONTEND_URL=<SERA_PREENCHIDO_DEPOIS>
PORT=3000
```

**4.5. Deploy:**
- Clique em "Create Web Service"
- Aguarde o deploy (5-10 minutos)
- Copie a URL (ex: `https://ejc-backend.onrender.com`)

**4.6. Popular banco de dados:**

No terminal do Render (Shell):
```bash
npm run prisma:seed
```

## 5. Deploy do Frontend - Vercel

**5.1. Criar conta na Vercel:**
- Acesse: https://vercel.com
- Clique em "Sign Up" e conecte com GitHub

**5.2. Importar projeto:**
- Clique em "Add New..." → "Project"
- Selecione seu repositório
- Configure:
  - **Framework Preset**: Vite
  - **Root Directory**: frontend
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

**5.3. Adicionar variável de ambiente:**

Em "Environment Variables", adicione:
```
VITE_API_URL=<URL_DO_BACKEND_RENDER>/api
```

Exemplo: `https://ejc-backend.onrender.com/api`

**5.4. Deploy:**
- Clique em "Deploy"
- Aguarde o deploy (2-5 minutos)
- Copie a URL (ex: `https://ejc-sistema.vercel.app`)

## 6. Finalizar Configuração

**6.1. Atualizar FRONTEND_URL no Backend:**
- Volte ao Render.com
- Acesse seu Web Service
- Vá em "Environment"
- Edite `FRONTEND_URL` para a URL da Vercel
- Clique em "Save Changes" (vai fazer redeploy automático)

**6.2. Testar o sistema:**
- Acesse a URL da Vercel
- Teste inscrição pública
- Teste login administrativo (admin@ejc.com / ejc2024)

## 7. Domínio Personalizado (Opcional)

### No Vercel (Frontend)
1. Vá em Settings → Domains
2. Adicione seu domínio (ex: `inscricoes.ejc.com.br`)
3. Configure DNS conforme instruções

### No Render (Backend)
1. Vá em Settings → Custom Domain
2. Adicione domínio (ex: `api.ejc.com.br`)
3. Configure DNS conforme instruções

## Limitações do Plano Gratuito

### Render (Backend)
- ⚠️ **Sleep após 15min de inatividade** (primeiro acesso pode demorar ~30s)
- 750 horas/mês (suficiente para um projeto)
- 512MB RAM

### Neon (Banco de Dados)
- 500MB de armazenamento
- 1 projeto
- Suficiente para ~5.000 inscrições

### Cloudinary (Arquivos)
- 25GB de armazenamento
- 25GB de banda/mês
- ~12.500 fotos 3x4

### Resend (Email)
- 3.000 emails/mês
- 100 emails/dia

## Monitoramento

### Backend (Render)
- Logs: Render Dashboard → Logs
- Métricas: Render Dashboard → Metrics

### Frontend (Vercel)
- Analytics: Vercel Dashboard → Analytics
- Logs: Vercel Dashboard → Deployments → View Function Logs

## Atualizações Futuras

Para atualizar o sistema:

1. Faça commits no GitHub:
```bash
git add .
git commit -m "Descrição da atualização"
git push
```

2. Render e Vercel farão deploy automático!

## Backup do Banco de Dados

Configure backup automático (script no backend):
- Os backups diários serão salvos no Cloudinary
- Rotina via node-cron já configurada no código

Para backup manual:
```bash
# No Shell do Render
pg_dump $DATABASE_URL > backup.sql
```

## Troubleshooting

### Backend não inicia
- Verifique logs no Render
- Confirme que `DATABASE_URL` está correto
- Verifique se as migrações rodaram

### Frontend não carrega dados
- Verifique se `VITE_API_URL` está correto
- Teste a URL do backend diretamente: `<URL_BACKEND>/health`
- Verifique CORS (FRONTEND_URL no backend)

### Upload de arquivos falha
- Confirme credenciais do Cloudinary
- Verifique limites de armazenamento

### Emails não enviam
- Verifique API Key do Resend
- Confirme limite diário não foi atingido
- Teste enviando email diretamente no painel Resend

## Custos Futuros (se crescer)

Quando atingir limites gratuitos, considere:
- **Render Pro**: $7/mês (sem sleep, mais RAM)
- **Neon Scale**: $19/mês (até 10GB)
- **Cloudinary Pro**: $89/mês (armazenamento ilimitado)
- **Resend Pro**: $20/mês (50.000 emails)

## Suporte

Para problemas específicos:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Neon: https://neon.tech/docs
- Cloudinary: https://cloudinary.com/documentation
- Resend: https://resend.com/docs

Parabéns! Seu sistema está no ar gratuitamente! 🎉
