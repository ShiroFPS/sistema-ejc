/**
 * Sanitiza query de busca para prevenir caracteres especiais maliciosos
 * @param {string} query - Query de busca do usuário
 * @returns {string} Query sanitizada
 */
export const sanitizeQuery = (query) => {
    if (!query || typeof query !== 'string') return '';

    // Remove caracteres especiais perigosos, mantém apenas alfanuméricos, espaços, @, ., -
    return query
        .replace(/[^\w\s@.-]/g, '')
        .trim()
        .slice(0, 100); // Limita a 100 caracteres
};

/**
 * Gera um código alfanumérico aleatório curto
 * @param {number} length - Tamanho do código
 * @returns {string} Código gerado
 */
export const generateShortCode = (length = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Wrapper para async handlers que captura erros automaticamente
 * @param {Function} fn - Função async do controller
 * @returns {Function} Middleware que captura erros
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
