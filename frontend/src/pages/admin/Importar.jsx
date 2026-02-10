import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import styles from './Dashboard.module.css'; // Reutilizando estilos
import toast from 'react-hot-toast';

const Importar = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Selecione um arquivo .xlsx');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const { data } = await api.post('/imports/workers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(data);
            toast.success(`Importação concluída: ${data.imported} importados.`);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao importar arquivo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>

            <div className="fade-in">
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Importar Dados</h1>
                        <p className={styles.subtitle}>Carregar planilha do Google Forms (.xlsx) - Encontristas ou Encontreiros</p>
                    </div>
                    <Button onClick={() => navigate('/admin/dashboard')} variant="ghost">
                        Voltar
                    </Button>
                </div>

                <Card>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ padding: '2rem', border: '2px dashed var(--glass-border)', borderRadius: '12px', textAlign: 'center' }}>
                            <input
                                type="file"
                                accept=".xlsx"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                                <p>Clique para selecionar o arquivo .xlsx</p>
                                {file && <p style={{ color: 'var(--color-primary-400)', fontWeight: 'bold', marginTop: '1rem' }}>{file.name}</p>}
                            </label>
                        </div>

                        <Button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            fullWidth
                            variant="primary"
                        >
                            {loading ? 'Processando...' : 'Iniciar Importação'}
                        </Button>

                        {result && (
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                <h3>Resultado:</h3>
                                <p style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-primary-400)' }}>
                                    Tipo detectado: {result.type === 'PARTICIPANTE' ? 'Participantes (Encontristas)' : 'Trabalhadores (Encontreiros)'}
                                </p>
                                <p>✅ Importados: {result.imported}</p>
                                <p>⚠️ Erros: {result.errors?.length || 0}</p>
                                {result.errors?.length > 0 && (
                                    <ul style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '0.5rem' }}>
                                        {result.errors.map((err, idx) => (
                                            <li key={idx} style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '4px' }}>
                                                {err.nome}: {err.erro}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Importar;
