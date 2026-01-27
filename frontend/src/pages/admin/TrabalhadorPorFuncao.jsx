import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import styles from './TrabalhadorPorFuncao.module.css';

const TrabalhadorPorFuncao = () => {
    const navigate = useNavigate();
    const [agrupamento, setAgrupamento] = useState({});
    const [loading, setLoading] = useState(true);
    const [expandidos, setExpandidos] = useState({});

    useEffect(() => {
        carregar();
    }, []);

    const carregar = async () => {
        try {
            const { data } = await api.get('/cracha/por-funcao');
            setAgrupamento(data);
        } catch (error) {
            toast.error('Erro ao carregar agrupamento');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpansao = (funcao) => {
        setExpandidos(prev => ({ ...prev, [funcao]: !prev[funcao] }));
    };

    const handleExportarExcel = async () => {
        try {
            const response = await api.get('/export/excel', {
                params: { tipo: 'TRABALHADOR', status: 'APROVADA', agrupado: 'true' },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `trabalhadores_funcao_${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Relatório gerado com sucesso!');
        } catch (error) {
            toast.error('Erro ao gerar relatório');
        }
    };

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Encontreiros por Função</h1>
                    <p className={styles.subtitle}>Agrupamento e organização das equipes</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button onClick={handleExportarExcel} variant="primary">
                        📊 Exportar Excel
                    </Button>
                    <Button onClick={() => navigate('/admin/dashboard')} variant="ghost">
                        ← Voltar
                    </Button>
                </div>
            </div>

            <div className={styles.funcoes}>
                {Object.entries(agrupamento).map(([funcao, dados]) => (
                    <Card key={funcao} className={styles.funcaoCard}>
                        <div
                            className={styles.funcaoHeader}
                            onClick={() => toggleExpansao(funcao)}
                        >
                            <div>
                                <h2 className={styles.funcaoNome}>{funcao}</h2>
                                <p className={styles.funcaoCount}>
                                    {dados.total} {dados.total === 1 ? 'encontreiro' : 'encontreiros'}
                                </p>
                            </div>
                            <span className={styles.toggleIcon}>
                                {expandidos[funcao] ? '▼' : '▶'}
                            </span>
                        </div>

                        {expandidos[funcao] && (
                            <div className={styles.trabalhadores}>
                                {dados.trabalhadores.length === 0 ? (
                                    <p className={styles.vazio}>Nenhum encontreiro nesta função</p>
                                ) : (
                                    dados.trabalhadores.map((trabalhador) => (
                                        <div key={trabalhador.id} className={styles.trabalhador}>
                                            <div className={styles.trabalhadorInfo}>
                                                <p className={styles.trabalhadorNome}>
                                                    {trabalhador.nomeCompleto1}
                                                    {trabalhador.nomeCompleto2 && ` & ${trabalhador.nomeCompleto2}`}
                                                </p>
                                                <p className={styles.trabalhadorContato}>
                                                    {trabalhador.email} • {trabalhador.contato1}
                                                </p>
                                                <p className={styles.trabalhadorCodigo}>
                                                    Código: <code>{trabalhador.codigoVerificacao}</code>
                                                </p>
                                            </div>
                                            <div className={styles.trabalhadorCor}>
                                                {trabalhador.corCracha && (
                                                    <span
                                                        className={styles.corBadge}
                                                        style={{
                                                            backgroundColor: {
                                                                'VERDE': '#22c55e',
                                                                'AMARELO': '#eab308',
                                                                'VERMELHO': '#ef4444',
                                                            }[trabalhador.corCracha]
                                                        }}
                                                    >
                                                        {trabalhador.corCracha}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TrabalhadorPorFuncao;
