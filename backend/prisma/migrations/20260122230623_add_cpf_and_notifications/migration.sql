-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_inscricoes_participantes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "codigoVerificacao" TEXT NOT NULL,
    "corCracha" TEXT,
    "lgpdCiente" BOOLEAN NOT NULL DEFAULT false,
    "nomeCompleto" TEXT NOT NULL,
    "apelido" TEXT NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "cpf" TEXT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_inscricoes_participantes" ("alergias", "amigosParentesInscritos", "apelido", "bairro", "batizado", "codigoVerificacao", "comprovanteUrl", "contatosEmergencia", "corCracha", "createdAt", "cursoAtual", "dataNascimento", "enderecoCompleto", "enderecoMae", "enderecoPai", "escolaridade", "estadoCivil", "estadoCivilPais", "fezCrisma", "fezPrimeiraComunhao", "fotoUrl", "id", "instagram", "instituicaoEnsino", "lgpdCiente", "localBatismo", "localTrabalho", "medicamentosContinuos", "moraComQuem", "nomeCompleto", "nomeMae", "nomePai", "problemasSaude", "profissao", "restricoesAlimentares", "sexo", "status", "telefone", "telefoneMae", "telefonePai", "trabalha", "updatedAt") SELECT "alergias", "amigosParentesInscritos", "apelido", "bairro", "batizado", "codigoVerificacao", "comprovanteUrl", "contatosEmergencia", "corCracha", "createdAt", "cursoAtual", "dataNascimento", "enderecoCompleto", "enderecoMae", "enderecoPai", "escolaridade", "estadoCivil", "estadoCivilPais", "fezCrisma", "fezPrimeiraComunhao", "fotoUrl", "id", "instagram", "instituicaoEnsino", "lgpdCiente", "localBatismo", "localTrabalho", "medicamentosContinuos", "moraComQuem", "nomeCompleto", "nomeMae", "nomePai", "problemasSaude", "profissao", "restricoesAlimentares", "sexo", "status", "telefone", "telefoneMae", "telefonePai", "trabalha", "updatedAt" FROM "inscricoes_participantes";
DROP TABLE "inscricoes_participantes";
ALTER TABLE "new_inscricoes_participantes" RENAME TO "inscricoes_participantes";
CREATE UNIQUE INDEX "inscricoes_participantes_codigoVerificacao_key" ON "inscricoes_participantes"("codigoVerificacao");
CREATE UNIQUE INDEX "inscricoes_participantes_cpf_key" ON "inscricoes_participantes"("cpf");
CREATE INDEX "inscricoes_participantes_status_idx" ON "inscricoes_participantes"("status");
CREATE INDEX "inscricoes_participantes_nomeCompleto_idx" ON "inscricoes_participantes"("nomeCompleto");
CREATE INDEX "inscricoes_participantes_cpf_idx" ON "inscricoes_participantes"("cpf");
CREATE TABLE "new_inscricoes_trabalhadores" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "dataNascimento1" DATETIME,
    "nomeCompleto2" TEXT,
    "cpf2" TEXT,
    "contato2" TEXT,
    "instagram2" TEXT,
    "sexo2" TEXT,
    "dataNascimento2" DATETIME,
    "receberEmail" BOOLEAN NOT NULL DEFAULT true,
    "receberWhatsapp" BOOLEAN NOT NULL DEFAULT true,
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
INSERT INTO "new_inscricoes_trabalhadores" ("apelido", "apelido2", "areaTrabalhoEstudo", "codigoVerificacao", "contato1", "contato2", "corCracha", "createdAt", "dataNascimento1", "dataNascimento2", "email", "enderecoCompleto", "equipesJaServiram", "funcaoTrabalhador", "grupoFuncional", "habilidadesComputador", "id", "instagram1", "instagram2", "nomeCompleto1", "nomeCompleto2", "operaEquipamentosSom", "paroquiaEjcAno", "qualInstrumento", "sabeCantar", "sexo1", "sexo2", "status", "tipoInscricao", "tocaInstrumento", "trabalhamOuEstudam", "trabalhosManuais", "updatedAt") SELECT "apelido", "apelido2", "areaTrabalhoEstudo", "codigoVerificacao", "contato1", "contato2", "corCracha", "createdAt", "dataNascimento1", "dataNascimento2", "email", "enderecoCompleto", "equipesJaServiram", "funcaoTrabalhador", "grupoFuncional", "habilidadesComputador", "id", "instagram1", "instagram2", "nomeCompleto1", "nomeCompleto2", "operaEquipamentosSom", "paroquiaEjcAno", "qualInstrumento", "sabeCantar", "sexo1", "sexo2", "status", "tipoInscricao", "tocaInstrumento", "trabalhamOuEstudam", "trabalhosManuais", "updatedAt" FROM "inscricoes_trabalhadores";
DROP TABLE "inscricoes_trabalhadores";
ALTER TABLE "new_inscricoes_trabalhadores" RENAME TO "inscricoes_trabalhadores";
CREATE UNIQUE INDEX "inscricoes_trabalhadores_codigoVerificacao_key" ON "inscricoes_trabalhadores"("codigoVerificacao");
CREATE INDEX "inscricoes_trabalhadores_status_idx" ON "inscricoes_trabalhadores"("status");
CREATE INDEX "inscricoes_trabalhadores_grupoFuncional_idx" ON "inscricoes_trabalhadores"("grupoFuncional");
CREATE INDEX "inscricoes_trabalhadores_cpf1_idx" ON "inscricoes_trabalhadores"("cpf1");
CREATE INDEX "inscricoes_trabalhadores_cpf2_idx" ON "inscricoes_trabalhadores"("cpf2");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
