-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'COORDENADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscricoes_participantes" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "codigoVerificacao" TEXT NOT NULL,
    "corCracha" TEXT,
    "corGrupo" TEXT,
    "lgpdCiente" BOOLEAN NOT NULL DEFAULT false,
    "nomeCompleto" TEXT NOT NULL,
    "apelido" TEXT NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT,
    "telefone" TEXT NOT NULL,
    "instagram" TEXT,
    "receberEmail" BOOLEAN NOT NULL DEFAULT true,
    "receberWhatsapp" BOOLEAN NOT NULL DEFAULT true,
    "estadoCivil" TEXT NOT NULL,
    "escolaridade" TEXT NOT NULL,
    "instituicaoEnsino" TEXT,
    "cursoAtual" TEXT,
    "profissao" TEXT NOT NULL,
    "trabalha" BOOLEAN NOT NULL DEFAULT false,
    "localTrabalho" TEXT,
    "batizado" BOOLEAN NOT NULL DEFAULT false,
    "localBatismo" TEXT,
    "fezPrimeiraComunhao" BOOLEAN NOT NULL DEFAULT false,
    "fezCrisma" BOOLEAN NOT NULL DEFAULT false,
    "enderecoCompleto" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "moraComQuem" TEXT NOT NULL,
    "estadoCivilPais" TEXT NOT NULL,
    "nomeMae" TEXT NOT NULL,
    "telefoneMae" TEXT NOT NULL,
    "enderecoMae" TEXT NOT NULL,
    "nomePai" TEXT NOT NULL,
    "telefonePai" TEXT NOT NULL,
    "enderecoPai" TEXT NOT NULL,
    "amigosParentesInscritos" TEXT,
    "contatosEmergencia" TEXT NOT NULL,
    "restricoesAlimentares" TEXT,
    "alergias" TEXT,
    "problemasSaude" TEXT,
    "medicamentosContinuos" TEXT,
    "fotoUrl" TEXT,
    "comprovanteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscricoes_participantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscricoes_trabalhadores" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "grupoFuncional" TEXT,
    "codigoVerificacao" TEXT NOT NULL,
    "corCracha" TEXT,
    "funcaoTrabalhador" TEXT,
    "apelido" TEXT,
    "apelido2" TEXT,
    "tipoInscricao" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomeCompleto1" TEXT NOT NULL,
    "cpf1" TEXT,
    "contato1" TEXT NOT NULL,
    "instagram1" TEXT NOT NULL,
    "sexo1" TEXT,
    "dataNascimento1" TIMESTAMP(3),
    "nomeCompleto2" TEXT,
    "cpf2" TEXT,
    "contato2" TEXT,
    "instagram2" TEXT,
    "sexo2" TEXT,
    "dataNascimento2" TIMESTAMP(3),
    "receberEmail" BOOLEAN NOT NULL DEFAULT true,
    "receberWhatsapp" BOOLEAN NOT NULL DEFAULT true,
    "enderecoCompleto" TEXT NOT NULL,
    "trabalhamOuEstudam" BOOLEAN NOT NULL DEFAULT false,
    "areaTrabalhoEstudo" TEXT,
    "profissao1" TEXT,
    "profissao2" TEXT,
    "paroquiaEjcAno" TEXT NOT NULL,
    "equipesJaServiram" TEXT NOT NULL,
    "tocaInstrumento" BOOLEAN NOT NULL DEFAULT false,
    "qualInstrumento" TEXT,
    "sabeCantar" BOOLEAN NOT NULL DEFAULT false,
    "operaEquipamentosSom" BOOLEAN NOT NULL DEFAULT false,
    "habilidadesComputador" BOOLEAN NOT NULL DEFAULT false,
    "trabalhosManuais" BOOLEAN NOT NULL DEFAULT false,
    "habilidadesTalentos" TEXT,
    "fotoUrl1" TEXT,
    "fotoUrl2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscricoes_trabalhadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "limiteParticipantes" INTEGER NOT NULL DEFAULT 100,
    "limiteTrabalhadores" INTEGER NOT NULL DEFAULT 100,
    "dataLimiteInscricoes" TEXT,
    "coresPersonalizadas" TEXT DEFAULT '{}',
    "emailsNotificacao" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "destinatario" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "erro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arquivos" (
    "id" TEXT NOT NULL,
    "nomeOriginal" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "dados" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arquivos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "inscricoes_participantes_codigoVerificacao_key" ON "inscricoes_participantes"("codigoVerificacao");

-- CreateIndex
CREATE UNIQUE INDEX "inscricoes_participantes_cpf_key" ON "inscricoes_participantes"("cpf");

-- CreateIndex
CREATE INDEX "inscricoes_participantes_status_idx" ON "inscricoes_participantes"("status");

-- CreateIndex
CREATE INDEX "inscricoes_participantes_nomeCompleto_idx" ON "inscricoes_participantes"("nomeCompleto");

-- CreateIndex
CREATE INDEX "inscricoes_participantes_cpf_idx" ON "inscricoes_participantes"("cpf");

-- CreateIndex
CREATE INDEX "inscricoes_participantes_status_createdAt_idx" ON "inscricoes_participantes"("status", "createdAt");

-- CreateIndex
CREATE INDEX "inscricoes_participantes_nomeCompleto_status_idx" ON "inscricoes_participantes"("nomeCompleto", "status");

-- CreateIndex
CREATE UNIQUE INDEX "inscricoes_trabalhadores_codigoVerificacao_key" ON "inscricoes_trabalhadores"("codigoVerificacao");

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_status_idx" ON "inscricoes_trabalhadores"("status");

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_grupoFuncional_idx" ON "inscricoes_trabalhadores"("grupoFuncional");

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_cpf1_idx" ON "inscricoes_trabalhadores"("cpf1");

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_cpf2_idx" ON "inscricoes_trabalhadores"("cpf2");

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_status_createdAt_idx" ON "inscricoes_trabalhadores"("status", "createdAt");

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_funcaoTrabalhador_status_idx" ON "inscricoes_trabalhadores"("funcaoTrabalhador", "status");

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_nomeCompleto1_idx" ON "inscricoes_trabalhadores"("nomeCompleto1");
