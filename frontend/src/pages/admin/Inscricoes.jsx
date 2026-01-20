import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import styles from './Inscricoes.module.css';

const Inscricoes = () => {
    const navigate = useNavigate();
    const [inscricoes, setInscricoes] = useState([]);
    const [filtros, setFiltros] = useState({ tipo: '', status: '', grupoFuncional: '' });
    const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarInscricoes();
    }, [filtros]);

    const carregarInscricoes = async () => {
        try {
            const params = { ...filtros, limit: 100 };
            const { data } = await api.get('/inscricoes', { params });
            setInscricoes(data.inscricoes);
        } catch (error) {
            toast.error('Erro ao carregar inscrições');
        } finally {
            setLoading(false);
        }
    };

    const handleBusca = async () => {
        if (!busca.trim()) return carregarInscricoes();

        try {
            const { data } = await api.get('/inscricoes/buscar', { params: { query: busca } });
            setInscricoes(data.inscricoes);
        } catch (error) {
            toast.error('Erro na busca');
        }
    };

    const handleAprovar = async (id, tipo) => {
        try {
            await api.patch(`/inscricoes/${id}/aprovar?tipo=${tipo}`);
            toast.success('Inscrição aprovada!');
            carregarInscricoes();
        } catch (error) {
            toast.error('Erro ao aprovar');
        }
    };

    const handleRejeitar = async (id, tipo) => {
        try {
            await api.patch(`/inscricoes/${id}/rejeitar?tipo=${tipo}`);
            toast.success('Inscrição rejeitada');
            carregarInscricoes();
        } catch (error) {
            toast.error('Erro ao rejeitar');
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await api.get('/export/excel', {
                params: filtros,
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `inscricoes_ejc_${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Planilha baixada!');
        } catch (error) {
            toast.error('Erro ao baixar planilha');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gerenciar Inscrições</h1>
                    <p className={styles.subtitle}>{inscricoes.length} inscrições encontradas</p>
                </div>
                <div className={styles.headerActions}>
                    <Button onClick={() => navigate('/admin/dashboard')} variant="ghost">
                        ← Voltar
                    </Button>
                    <Button onClick={downloadExcel} variant="secondary">
                        📊 Exportar Excel
                    </Button>
                </div>
            </div>

            <Card className={styles.filters}>
                <h3 className={styles.filterTitle}>Filtros</h3>
                <div className={styles.filterGrid}>
                    <div>
                        <label>Tipo</label>
                        <select
                            value={filtros.tipo}
                            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                            className={styles.select}
                        >
                            <option value="">Todos</option>
                            <option value="PARTICIPANTE">Participante</option>
                            <option value="TRABALHADOR">Trabalhador</option>
                        </select>
                    </div>

                    <div>
                        <label>Status</label>
                        <select
                            value={filtros.status}
                            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                            className={styles.select}
                        >
                            <option value="">Todos</option>
                            <option value="PENDENTE">Pendente</option>
                            <option value="APROVADA">Aprovada</option>
                            <option value="REJEITADA">Rejeitada</option>
                        </select>
                    </div>

                    <div>
                        <label>Grupo Funcional (Círculo)</label>
                        <select
                            value={filtros.grupoFuncional}
                            onChange={(e) => setFiltros({ ...filtros, grupoFuncional: e.target.value })}
                            className={styles.select}
                        >
                            <option value="">Todos</option>
                            <option value="VERMELHO">Círculo Vermelho</option>
                            <option value="VERDE">Círculo Verde</option>
                            <option value="AMARELO">Círculo Amarelo</option>
                        </select>
                    </div>

                    <div>
                        <label>Busca de Nome/Amigos</label>
                        <div className={styles.searchBox}>
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
                                placeholder="Digite e pressione Enter"
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <div className={styles.list}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>Carregando...</p>
                ) : inscricoes.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>Nenhuma inscrição encontrada</p>
                ) : (
                    inscricoes.map((inscricao) => (
                        <Card key={inscricao.id} className={styles.inscricaoCard}>
                            <div className={styles.inscricaoHeader}>
                                <div>
                                    <h3>{inscricao.nomeCompleto}</h3>
                                    <p>{inscricao.apelido} • {inscricao.telefone}</p>
                                </div>
                                <div className={styles.badges}>
                                    <span className={`${styles.badge} ${styles[inscricao.tipo]}`}>
                                        {inscricao.tipo}
                                    </span>
                                    <span className={`${styles.badge} ${styles[inscricao.status]}`}>
                                        {inscricao.status}
                                    </span>
                                    {inscricao.grupoFuncional && ['VERDE', 'AMARELO', 'VERMELHO'].includes(inscricao.grupoFuncional) && (
                                        <span className={`${styles.badge} ${styles[inscricao.grupoFuncional]}`}>
                                            {inscricao.grupoFuncional}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.inscricaoActions}>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => navigate(`/admin/inscricoes/${inscricao.id}`)}
                                >
                                    Ver Detalhes
                                </Button>

                                {inscricao.tipo === 'TRABALHADOR' && (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => navigate(`/admin/trabalhadores/editar/${inscricao.id}`)}
                                    >
                                        ✏️ Editar
                                    </Button>
                                )}

                                {inscricao.status === 'PENDENTE' && (
                                    <>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAprovar(inscricao.id, inscricao.tipo)}
                                        >
                                            ✅ Aprovar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleRejeitar(inscricao.id, inscricao.tipo)}
                                        >
                                            ❌ Rejeitar
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Inscricoes;
