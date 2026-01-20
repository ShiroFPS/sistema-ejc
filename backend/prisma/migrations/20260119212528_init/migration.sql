-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'COORDENADOR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "inscricoes_participantes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "lgpdCiente" BOOLEAN NOT NULL DEFAULT false,
    "nomeCompleto" TEXT NOT NULL,
    "apelido" TEXT NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "instagram" TEXT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "inscricoes_trabalhadores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "grupoFuncional" TEXT,
    "tipoInscricao" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomeCompleto1" TEXT NOT NULL,
    "contato1" TEXT NOT NULL,
    "instagram1" TEXT NOT NULL,
    "nomeCompleto2" TEXT,
    "contato2" TEXT,
    "instagram2" TEXT,
    "enderecoCompleto" TEXT NOT NULL,
    "trabalhamOuEstudam" BOOLEAN NOT NULL DEFAULT false,
    "areaTrabalhoEstudo" TEXT,
    "paroquiaEjcAno" TEXT NOT NULL,
    "equipesJaServiram" TEXT NOT NULL,
    "tocaInstrumento" BOOLEAN NOT NULL DEFAULT false,
    "qualInstrumento" TEXT,
    "sabeCantar" BOOLEAN NOT NULL DEFAULT false,
    "operaEquipamentosSom" BOOLEAN NOT NULL DEFAULT false,
    "habilidadesComputador" BOOLEAN NOT NULL DEFAULT false,
    "trabalhosManuais" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "configuracoes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "limiteParticipantes" INTEGER NOT NULL DEFAULT 100,
    "limiteTrabalhadores" INTEGER NOT NULL DEFAULT 100,
    "dataLimiteInscricoes" TEXT,
    "coresPersonalizadas" TEXT DEFAULT '{}',
    "emailsNotificacao" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "destinatario" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "erro" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
