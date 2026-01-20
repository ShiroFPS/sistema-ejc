# Guia de Instalação Local - Sistema EJC

Este guia explica como instalar e executar o Sistema de Inscrições EJC localmente para desenvolvimento.

## Pré-requisitos

- **Node.js**: v18 ou superior ([Download](https://nodejs.org/))
- **PostgreSQL**: v14 ou superior ([Download](https://www.postgresql.org/download/))
- **Git**: Para clonar o repositório

## 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd SISTEMA_EJC
```

## 2. Configurar Banco de Dados PostgreSQL

1. Acesse o PostgreSQL:
```bash
psql -U postgres
```

2. Crie o banco de dados:
```sql
CREATE DATABASE ejc_db;
```

3. Saia do psql:
```sql
\q
```

## 3. Configurar Backend

**3.1. Instalar dependências:**
```bash
cd backend
npm install
```

**3.2. Configurar variáveis de ambiente:**

Copie o arquivo `.env.example` para `.env`:
```bash
copy .env.example .env
```

Edite o arquivo `.env` e preencha as variáveis:

```env
# Database (ajuste conforme sua instalação)
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/ejc_db?schema=public"

# JWT (gere uma chave secreta forte)
JWT_SECRET="sua_chave_secreta_super_segura_aqui"
JWT_EXPIRES_IN="7d"

# Cloudinary (crie conta gratuita em cloudinary.com)
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="sua_api_secret"

# Email - Resend (crie conta gratuita em resend.com)
RESEND_API_KEY="sua_resend_api_key"
EMAIL_FROM="noreply@seudominio.com"

# WhatsApp (opcional)
WHATSAPP_ENABLED="false"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Port
PORT=3000
```

**3.3. Executar migrações do Prisma:**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

**3.4. Popular banco com dados iniciais:**
```bash
npm run prisma:seed
```

Isso criará 3 usuários:
- **Admin**: admin@ejc.com / ejc2024
- **Coordenador 1**: coordenador1@ejc.com / ejc2024
- **Coordenador 2**: coordenador2@ejc.com / ejc2024

**3.5. Iniciar servidor backend:**
```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`

## 4. Configurar Frontend

Em um novo terminal:

**4.1. Instalar dependências:**
```bash
cd frontend
npm install
```

**4.2. Configurar variáveis de ambiente:**

Copie o arquivo `.env.example` para `.env`:
```bash
copy .env.example .env
```

O conteúdo padrão já está correto para desenvolvimento local:
```env
VITE_API_URL=http://localhost:3000/api
```

**4.3. Iniciar servidor frontend:**
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 5. Acessar o Sistema

### Área Pública
- Home: http://localhost:5173
- Inscrição Participante: http://localhost:5173/inscricao/participante
- Inscrição Trabalhador: http://localhost:5173/inscricao/trabalhador

### Área Administrativa
- Login: http://localhost:5173/login
- Dashboard: http://localhost:5173/admin/dashboard

**Credenciais de acesso:**
- Email: admin@ejc.com
- Senha: ejc2024

## 6. Comandos Úteis

### Backend
```bash
npm run dev          # Inicia servidor em modo desenvolvimento
npm run start        # Inicia servidor em modo produção
npm run prisma:studio # Abre interface visual do banco de dados
npm run prisma:seed  # Popula banco com dados iniciais
```

### Frontend
```bash
npm run dev     # Inicia servidor de desenvolvimento
npm run build   # Cria build de produção
npm run preview # Visualiza build de produção
```

## Solução de Problemas

### Erro de conexão com banco de dados
- Verifique se o PostgreSQL está rodando
- Confirme se as credenciais no `DATABASE_URL` estão corretas
- Certifique-se de que o banco `ejc_db` foi criado

### Erro de CORS
- Verifique se `FRONTEND_URL` no backend está configurado corretamente
- Confirme que ambos servidores (backend e frontend) estão rodando

### Erro ao fazer upload de arquivos
- Verifique se as credenciais do Cloudinary estão corretas
- Teste as credenciais no painel do Cloudinary

### Porta já em uso
- Backend: Mude a variável `PORT` no `.env`
- Frontend: Mude a porta no `vite.config.js`

## Próximos Passos

Após a instalação local, consulte:
- **DEPLOY.md**: Para fazer deploy em produção (gratuito)
- **GUIA_USO.md**: Para aprender a usar o sistema

## Suporte

Para dúvidas ou problemas, consulte a documentação completa ou entre em contato com o desenvolvedor.
