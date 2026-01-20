# Sistema Web de Inscrições - EJC

<div align="center">

![Logo EJC](frontend/src/assets/logo-ejc.jpg)

**Sistema completo de gerenciamento de inscrições para o Encontro de Jovens com Cristo**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

## 📋 Sobre o Projeto

Sistema web moderno e completo para gerenciar inscrições de participantes e trabalhadores do EJC (Encontro de Jovens com Cristo). Desenvolvido com foco em usabilidade, segurança e design atraente.

### ✨ Características Principais

- ✅ **Inscrições Públicas** - Formulários completos sem necessidade de login
- 🔐 **Área Administrativa Protegida** - Sistema de autenticação robusto
- 📊 **Dashboard Completo** - Estat
ísticas em tempo real
- ✅ **Aprovação Manual** - Controle total sobre inscrições
- 📄 **Exportação** - PDF (fichas, listas) e Excel
- 🎨 **Design Moderno** - Dark mode com efeito glassmorphism
- 📱 **Totalmente Responsivo** - Funciona perfeitamente em mobile/tablet/desktop
- ☁️ **Deploy Gratuito** - Configurado para hospedagem 100% gratuita
- 📧 **Notificações** - Email e WhatsApp (configurável)

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express.js** - API REST
- **Prisma ORM** - Gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação segura
- **Cloudinary** - Upload e armazenamento de arquivos
- **PDFKit** - Geração de PDFs
- **ExcelJS** - Exportação para Excel
- **Resend** - Envio de emails

### Frontend
- **React 18** - Interface de usuário
- **Vite** - Build tool rápido
- **React Router** - Navegação
- **React Hook Form** - Formulários
- **Zod** - Validação de dados
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilização isolada

## 📦 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL 14 ou superior
- Conta gratuita no Cloudinary
- Conta gratuita no Resend (para emails)

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone <URL_DO_REPOSITORIO>
cd SISTEMA_EJC
```

2. **Configure o backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edite .env com suas configurações
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

3. **Configure o frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

4. **Acesse o sistema:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

**Credenciais padrão:**
- Email: admin@ejc.com
- Senha: ejc2024

Para instruções detalhadas, consulte [INSTALACAO.md](docs/INSTALACAO.md)

## 🌐 Deploy em Produção

O sistema está configurado para deploy **100% gratuito** usando:

- **Frontend**: Vercel
- **Backend**: Render.com
- **Banco de Dados**: Neon PostgreSQL
- **Arquivos**: Cloudinary
- **Emails**: Resend

Para instruções completas de deploy, consulte [DEPLOY.md](docs/DEPLOY.md)

## 📖 Documentação

- [📥 Instalação Local](docs/INSTALACAO.md)
- [🚀 Deploy em Produção](docs/DEPLOY.md)
- [📚 Guia de Uso](docs/GUIA_USO.md)

## 🎯 Funcionalidades

### Área Pública

#### Formulário de Inscrição
- 40+ campos conforme requisitos do EJC
- Dados pessoais completos
- Informações religiosas
- Dados de saúde e restrições
- 5 contatos de emergência
- Upload de foto 3x4
- Upload de comprovante de pagamento
- Validação em tempo real
- Verificação de limites de vagas

### Área Administrativa

#### Dashboard
- Estatísticas em tempo real
- Total de participantes e trabalhadores
- Inscrições pendentes e aprovadas
- Vagas restantes

#### Gerenciamento de Inscrições
- Listagem com filtros avançados
- Busca por nome ou amigos citados
- Visualização detalhada
- Aprovação/rejeição
- Edição de dados
- Criação manual

#### Exportações
- Lista de presença (PDF)
- Ficha individual de entrevista (PDF)
- Planilha completa (Excel)

#### Configurações (Admin)
- Gerenciar limites de vagas
- Definir data limite de inscrições
- Personalizar cores (futuro)

## 👥 Roles e Permissões

| Funcionalidade | Admin | Coordenador |
|---------------|-------|-------------|
| Ver inscrições | ✅ | ✅ |
| Aprovar/Rejeitar | ✅ | ✅ |
|Editar inscrições | ✅ | ✅ |
| Criar inscrição manual | ✅ | ✅ |
| Exportar dados | ✅ | ✅ |
| Deletar inscrições | ✅ | ❌ |
| Configurar sistema | ✅ | ❌ |

## 🗂️ Estrutura do Projeto

```
SISTEMA_EJC/
├── backend/
│   ├── prisma/              # Schema e migrações
│   ├── src/
│   │   ├── config/          # Configurações
│   │   ├── controllers/     # Controladores
│   │   ├── middlewares/     # Middlewares
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Serviços (email, WhatsApp)
│   │   ├── utils/           # Utilitários (PDF, Excel)
│   │   └── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/          # Imagens, logo
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas
│   │   │   └── admin/       # Páginas administrativas
│   │   ├── services/        # API client
│   │   ├── styles/          # Estilos globais
│   │   └── App.jsx          # App principal
│   └── package.json
│
└── docs/                    # Documentação
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🛟 Suporte

Se você tiver dúvidas ou problemas:

1. Consulte a [documentação](docs/)
2. Abra uma [issue](../../issues)
3. Entre em contato com o desenvolvedor

## 🙏 Agradecimentos

- Paróquia Nossa Senhora Auxiliadora
- Equipe EJC
- Todos os colaboradores

---

<div align="center">

**Feito com ❤️ para o EJC**

</div>
