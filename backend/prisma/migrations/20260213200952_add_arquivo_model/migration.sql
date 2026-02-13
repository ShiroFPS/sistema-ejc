-- AlterTable
ALTER TABLE "inscricoes_participantes" ADD COLUMN "corGrupo" TEXT;

-- AlterTable
ALTER TABLE "inscricoes_trabalhadores" ADD COLUMN "fotoUrl1" TEXT;
ALTER TABLE "inscricoes_trabalhadores" ADD COLUMN "fotoUrl2" TEXT;
ALTER TABLE "inscricoes_trabalhadores" ADD COLUMN "habilidadesTalentos" TEXT;
ALTER TABLE "inscricoes_trabalhadores" ADD COLUMN "profissao1" TEXT;
ALTER TABLE "inscricoes_trabalhadores" ADD COLUMN "profissao2" TEXT;

-- CreateTable
CREATE TABLE "arquivos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomeOriginal" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "dados" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_nomeCompleto1_idx" ON "inscricoes_trabalhadores"("nomeCompleto1");
