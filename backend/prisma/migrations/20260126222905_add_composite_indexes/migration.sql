-- CreateIndex
CREATE INDEX "inscricoes_participantes_status_createdAt_idx" ON "inscricoes_participantes"("status", "createdAt");

-- CreateIndex
CREATE INDEX "inscricoes_participantes_nomeCompleto_status_idx" ON "inscricoes_participantes"("nomeCompleto", "status");

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_status_createdAt_idx" ON "inscricoes_trabalhadores"("status", "createdAt");

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_funcaoTrabalhador_status_idx" ON "inscricoes_trabalhadores"("funcaoTrabalhador", "status");
