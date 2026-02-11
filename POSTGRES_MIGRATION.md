# Migração para PostgreSQL - Instruções

O sistema foi atualizado para usar **PostgreSQL** em produção (Render) em vez de SQLite, garantindo persistência dos dados.

## ✅ Mudanças Realizadas

- ✅ `schema.prisma` atualizado para `provider = "postgresql"`
- ✅ `render.yaml` configurado para usar migrations PostgreSQL
- ✅ `.env` documentado para ambos os ambientes (dev/prod)

## 🚀 Como Fazer Deploy no Render

### Passo 1: Criar Banco PostgreSQL no Render

1. Acesse [Dashboard do Render](https://dashboard.render.com/)
2. Clique em **"New +"** → **"PostgreSQL"**
3. Preencha:
   - **Name:** `sistema-ejc-db` (ou qualquer nome)
   - **Database:** `sistema_ejc`
   - **User:** (deixe o padrão)
   - **Region:** Mesma região do backend
   - **Plan:** **Free**
4. Clique em **"Create Database"**
5. Aguarde a criação (1-2 minutos)

### Passo 2: Vincular ao Backend

1. Vá em **"Services"** → Selecione `sistema-ejc-backend`
2. Vá em **"Environment"** (menu lateral)
3. Procure por `DATABASE_URL`:
   - Se **NÃO existir:** Clique em "Add Environment Variable"
     - Key: `DATABASE_URL`
     - Value: Clique em "Link to PostgreSQL" → Selecione `sistema-ejc-db`
   - Se **JÁ existir:** Clique em "Edit" → Selecione o banco PostgreSQL criado
4. Clique em **"Save Changes"**

### Passo 3: Deploy

1. No serviço `sistema-ejc-backend`, clique em **"Manual Deploy"**
2. Selecione **"Deploy latest commit"**
3. Aguarde o build (3-5 minutos)

O sistema irá:
- ✅ Instalar dependências
- ✅ Gerar Prisma Client para PostgreSQL
- ✅ Executar migrations (criar tabelas)
- ✅ Executar seed (criar admin padrão)
- ✅ Iniciar servidor

### Passo 4: Verificar

1. Acesse a URL do backend: `https://sistema-ejc-backend.onrender.com`
2. Deve retornar: `{"status":"OK","message":"Sistema EJC Backend"}`
3. Teste o login no frontend

## 💡 Desenvolvimento Local (Opcional)

Se quiser usar PostgreSQL localmente:

### Opção A: Docker (Recomendado)

```bash
# Iniciar PostgreSQL via Docker
docker run --name postgres-ejc -e POSTGRES_PASSWORD=senha123 -e POSTGRES_DB=sistema_ejc -p 5432:5432 -d postgres:15

# Atualizar .env
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/sistema_ejc"

# Rodar migrations
cd backend
npx prisma migrate dev
```

### Opção B: Continuar com SQLite Local

Você pode manter SQLite localmente e PostgreSQL apenas em produção:

```bash
# .env (local)
DATABASE_URL="file:./dev.db"
```

Basta **NÃO** commitar mudanças no `.env` quando fizer push.

## ❌ Troubleshooting

### Erro: "No migration found"
- **Causa:** Migrations ainda não foram criadas
- **Solução:** O primeiro deploy criará automaticamente

### Erro: "Connection timeout"
- **Causa:** DATABASE_URL não está configurada
- **Solução:** Siga o "Passo 2" acima

### Erro: "Table already exists"
- **Causa:** Banco já tem dados de tentativas anteriores
- **Solução:** No Render, vá no banco PostgreSQL → "Danger Zone" → "Reset Database"

## 📋 Checklist Final

- [ ] Banco PostgreSQL criado no Render
- [ ] `DATABASE_URL` vinculada ao backend
- [ ] Deploy disparado
- [ ] Build concluído com sucesso
- [ ] Login funcionando no frontend
