-- CreateIndex
CREATE INDEX "inscricoes_participantes_status_idx" ON "inscricoes_participantes"("status");

-- CreateIndex
CREATE INDEX "inscricoes_participantes_nomeCompleto_idx" ON "inscricoes_participantes"("nomeCompleto");

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_status_idx" ON "inscricoes_trabalhadores"("status");

-- CreateIndex
CREATE INDEX "inscricoes_trabalhadores_grupoFuncional_idx" ON "inscricoes_trabalhadores"("grupoFuncional");
