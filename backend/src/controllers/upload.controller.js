import { prisma } from '../utils/prisma.js';
import sharp from 'sharp';

export const uploadFoto = async (req, res, next) => {
    try {
        if (!req.files || !req.files.foto) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const foto = req.files.foto;

        // Validar tipo de arquivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(foto.mimetype)) {
            return res.status(400).json({ error: 'Apenas imagens JPG, JPEG e PNG são aceitas' });
        }

        // Validar tamanho (máx 5MB)
        if (foto.size > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'Arquivo deve ter no máximo 5MB' });
        }

        // Processar imagem com Sharp
        const processedImage = await sharp(foto.data)
            .resize(240, 320, {
                fit: 'cover',
                position: 'top' // Foca no rosto/topo
            })
            .jpeg({ quality: 80 })
            .toBuffer();

        // Salvar no Banco via Prisma
        const arquivo = await prisma.arquivo.create({
            data: {
                nomeOriginal: foto.name,
                mimetype: 'image/jpeg', // Sempre convertemos para JPEG
                tamanho: processedImage.length,
                dados: processedImage
            }
        });

        // Retornar URL para acessar o arquivo
        const fileUrl = `${req.protocol}://${req.get('host')}/api/upload/file/${arquivo.id}`;
        res.json({ url: fileUrl });

    } catch (error) {
        console.error('Erro no upload de foto:', error);
        next(error);
    }
};

export const uploadComprovante = async (req, res, next) => {
    try {
        if (!req.files || !req.files.comprovante) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const comprovante = req.files.comprovante;

        // Validar tipo de arquivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(comprovante.mimetype)) {
            return res.status(400).json({ error: 'Apenas imagens (JPG, PNG) e PDFs são aceitos' });
        }

        // Validar tamanho (máx 10MB)
        if (comprovante.size > 10 * 1024 * 1024) {
            return res.status(400).json({ error: 'Arquivo deve ter no máximo 10MB' });
        }

        // Salvar no Banco (sem processamento para PDF/Imagens completas)
        const arquivo = await prisma.arquivo.create({
            data: {
                nomeOriginal: comprovante.name,
                mimetype: comprovante.mimetype,
                tamanho: comprovante.size,
                dados: comprovante.data
            }
        });

        const fileUrl = `${req.protocol}://${req.get('host')}/api/upload/file/${arquivo.id}`;
        res.json({ url: fileUrl });

    } catch (error) {
        console.error('Erro no upload de comprovante:', error);
        next(error);
    }
};

// Nova rota para servir os arquivos
export const getArquivo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const arquivo = await prisma.arquivo.findUnique({
            where: { id }
        });

        if (!arquivo) {
            return res.status(404).json({ error: 'Arquivo não encontrado' });
        }

        // Definir headers corretos
        res.setHeader('Content-Type', arquivo.mimetype);
        res.setHeader('Content-Length', arquivo.tamanho);
        // Cache por 1 dia
        res.setHeader('Cache-Control', 'public, max-age=86400');

        res.send(arquivo.dados);

    } catch (error) {
        console.error('Erro ao recuperar arquivo:', error);
        next(error);
    }
};
