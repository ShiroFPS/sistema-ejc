import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import styles from './InscricaoDetalhes.module.css';

const InscricaoDetalhes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inscricao, setInscricao] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregar();
    }, [id]);

    const carregar = async () => {
        try {
            const { data } = await api.get(`/inscricoes/${id}`);
            setInscricao(data);
        } catch (error) {
            toast.error('Erro ao carregar inscrição');
            navigate('/admin/inscricoes');
        } finally {
            setLoading(false);
        }
    };

    const downloadFicha = async () => {
        try {
            const response = await api.get(`/export/pdf/ficha/${id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ficha_${inscricao.nomeCompleto}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Ficha baixada!');
        } catch (error) {
            toast.error('Erro ao baixar ficha');
        }
    };

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (!inscricao) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button onClick={() => navigate('/admin/inscricoes')} variant="ghost">
                    ← Voltar
                </Button>
                <Button onClick={downloadFicha} variant="secondary">
                    📄 Baixar Ficha PDF
                </Button>
            </div>

            <Card>
                <h1 className={styles.title}>{inscricao.nomeCompleto}</h1>
                <div className={styles.badges}>
                    <span className={`${styles.badge} ${styles[inscricao.tipo]}`}>
                        {inscricao.tipo}
                    </span>
                    <span className={`${styles.badge} ${styles[inscricao.status]}`}>
                        {inscricao.status}
                    </span>
                    {inscricao.grupoFuncional && (
                        <span className={`${styles.badge} ${styles[inscricao.grupoFuncional]}`}>
                            {inscricao.grupoFuncional}
                        </span>
                    )}
                </div>
            </Card>

            <Card>
                <h2 className={styles.sectionTitle}>👤 Dados Pessoais</h2>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Nome Completo</label>
                        <p>{inscricao.nomeCompleto}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Apelido</label>
                        <p>{inscricao.apelido}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Data de Nascimento</label>
                        <p>{new Date(inscricao.dataNascimento).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Sexo</label>
                        <p>{inscricao.sexo}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Telefone</label>
                        <p>{inscricao.telefone}</p>
                    </div>
                    {inscricao.instagram && (
                        <div className={styles.field}>
                            <label>Instagram</label>
                            <p>{inscricao.instagram}</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card>
                <h2 className={styles.sectionTitle}>🏠 Endereço</h2>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Endereço Completo</label>
                        <p>{inscricao.enderecoCompleto}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Bairro</label>
                        <p>{inscricao.bairro}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Mora com</label>
                        <p>{inscricao.moraComQuem}</p>
                    </div>
                </div>
            </Card>

            {inscricao.fotoUrl && (
                <Card>
                    <h2 className={styles.sectionTitle}>📷 Foto 3x4</h2>
                    <img src={inscricao.fotoUrl} alt="Foto" className={styles.foto} />
                </Card>
            )}

            {/* Adicionar mais seções conforme necessário */}
        </div>
    );
};

export default InscricaoDetalhes;
