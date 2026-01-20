import cloudinary from '../config/cloudinary.js';

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

        // Upload para Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'ejc/fotos',
                    transformation: [
                        { width: 300, height: 400, crop: 'fill' },
                        { quality: 'auto' }
                    ],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(foto.data);
        });

        res.json({ url: result.secure_url });
    } catch (error) {
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

        // Upload para Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'ejc/comprovantes',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(comprovante.data);
        });

        res.json({ url: result.secure_url });
    } catch (error) {
        next(error);
    }
};
