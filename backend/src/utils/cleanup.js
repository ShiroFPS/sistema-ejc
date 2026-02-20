import prisma from './prisma.js';

/**
 * Extrai o ID do arquivo a partir da URL.
 * Espera URLs no formato: .../api/upload/file/[ID]
 */
export const extractFileId = (url) => {
    if (!url) return null;
    try {
        const parts = url.split('/');
        const possibleId = parts[parts.length - 1];
        // Validação básica de ID (cuid ou uuid)
        if (possibleId && possibleId.length > 10) {
            return possibleId;
        }
        return null;
    } catch (e) {
        console.error('Erro ao extrair ID do arquivo:', e);
        return null;
    }
};

/**
 * Remove arquivos do banco de dados baseados em uma lista de URLs.
 */
export const deleteAssociatedFiles = async (urls) => {
    if (!urls || !Array.isArray(urls) || urls.length === 0) return;

    const idsToDelete = urls
        .map(url => extractFileId(url))
        .filter(id => id !== null);

    if (idsToDelete.length === 0) return;

    try {
        const result = await prisma.arquivo.deleteMany({
            where: {
                id: {
                    in: idsToDelete
                }
            }
        });
        console.log(`🗑️ Limpeza de arquivos: ${result.count} arquivos removidos.`);
    } catch (error) {
        console.error('❌ Erro ao limpar arquivos associados:', error);
        // Não lançar erro para não interromper o fluxo principal (exclusão do usuário)
    }
};
