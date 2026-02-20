import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';

import api, { fetcher } from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import styles from './Inscricoes.module.css';

const Inscricoes = () => {
    const navigate = useNavigate();
    const [filtros, setFiltros] = useState({ tipo: '', status: '', grupoFuncional: '', funcaoTrabalhador: '', corGrupo: '' });
    const [busca, setBusca] = useState('');

    // Chave reativa para SWR — muda sempre que filtros ou busca mudam
    const swrKey = (() => {
        const params = new URLSearchParams({ ...filtros, limit: 200 });
        if (busca.trim()) params.append('query', busca);
        return busca.trim() ? `/inscricoes/buscar?${params.toString()}` : `/inscricoes?${params.toString()}`;
    })();

    const { data, error, mutate, isLoading } = useSWR(swrKey, fetcher, {
        keepPreviousData: true,
        revalidateOnFocus: false,
    });

    const inscricoes = data?.inscricoes ?? [];

    const handleBusca = () => { /* SWR reage automaticamente via swrKey */ };

    const handleAprovar = async (id, tipo) => {
        try {
            await api.patch(`/inscricoes/${id}/aprovar?tipo=${tipo}`);
            toast.success('Inscrição aprovada!');
            mutate(); // Revalida o cache localmente
        } catch (error) {
            toast.error('Erro ao aprovar');
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
            <div className={styles.blob}></div>

            <motion.div
                className="fade-in"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Gerenciar Inscrições</h1>
                        <p className={styles.subtitle}>{data?.total ?? inscricoes.length} registros no sistema</p>
                    </div>
                    <div className={styles.headerActions}>
                        <Button onClick={() => navigate('/admin/dashboard')} variant="ghost">
                            ← Dashboard
                        </Button>
                        <Button onClick={downloadExcel} variant="secondary">
                            📊 Exportar Excel
                        </Button>
                    </div>
                </div>

                <Card className={styles.filters}>
                    <h3 className={styles.filterTitle}>Filtros Avançados</h3>
                    <div className={styles.filterGrid}>
                        <div className={styles.filterGroup}>
                            <label>Tipo de Registro</label>
                            <select
                                value={filtros.tipo}
                                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                className={styles.select}
                            >
                                <option value="">Todos</option>
                                <option value="PARTICIPANTE">Encontrista</option>
                                <option value="TRABALHADOR">Encontreiro</option>
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Status Atual</label>
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

                        {filtros.tipo === 'TRABALHADOR' && (
                            <div className={styles.filterGroup}>
                                <label>Equipe / Função</label>
                                <select
                                    value={filtros.funcaoTrabalhador}
                                    onChange={(e) => setFiltros({ ...filtros, funcaoTrabalhador: e.target.value })}
                                    className={styles.select}
                                >
                                    <option value="">Todas</option>
                                    <option value="Cozinha">Cozinha</option>
                                    <option value="Liturgia & Vigília">Liturgia</option>
                                    <option value="Secretaria">Secretaria</option>
                                    <option value="Som & Iluminação">Som</option>
                                    <option value="Trânsito & Recepção">Trânsito</option>
                                    <option value="Ordem">Ordem</option>
                                    {/* Adicione outras se necessário, ou busque do array de constantes */}
                                </select>
                            </div>
                        )}

                        {filtros.tipo === 'PARTICIPANTE' && (
                            <div className={styles.filterGroup}>
                                <label>Cor do Grupo</label>
                                <select
                                    value={filtros.corGrupo}
                                    onChange={(e) => setFiltros({ ...filtros, corGrupo: e.target.value })}
                                    className={styles.select}
                                >
                                    <option value="">Todas</option>
                                    <option value="VERMELHO">Vermelho</option>
                                    <option value="VERDE">Verde</option>
                                    <option value="AMARELO">Amarelo</option>
                                    <option value="AZUL">Azul</option>
                                    <option value="LARANJA">Laranja</option>
                                </select>
                            </div>
                        )}

                        {filtros.tipo === 'TRABALHADOR' && (
                            <div className={styles.filterGroup}>
                                <label>Círculo / Grupo</label>
                                <select
                                    value={filtros.grupoFuncional}
                                    onChange={(e) => setFiltros({ ...filtros, grupoFuncional: e.target.value })}
                                    className={styles.select}
                                >
                                    <option value="">Todos os Grupos</option>
                                    <option value="VERMELHO">Vermelho</option>
                                    <option value="VERDE">Verde</option>
                                    <option value="AMARELO">Amarelo</option>
                                </select>
                            </div>
                        )}

                        <div className={styles.filterGroup}>
                            <label>Pesquisar</label>
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
                                placeholder="Nome ou CPF..."
                                className={styles.input}
                            />
                        </div>
                    </div>
                </Card>

                <div className={styles.list}>
                    {isLoading && !data ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>Carregando dados...</div>
                    ) : inscricoes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>Nenhum registro encontrado.</div>
                    ) : (
                        <div className={styles.list}>
                            <AnimatePresence mode="popLayout">
                                {inscricoes.map((inscricao, index) => (
                                    <motion.div
                                        key={inscricao.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className={styles.inscricaoCard}>
                                            <div className={styles.inscricaoInfo}>
                                                <div className={styles.badges}>
                                                    <span className={`${styles.badge} ${styles[inscricao.tipo]}`}>
                                                        {inscricao.tipo === 'TRABALHADOR' ? 'ENCONTREIRO' : 'ENCONTRISTA'}
                                                    </span>
                                                    <span className={`${styles.badge} ${styles[inscricao.status]}`}>
                                                        {inscricao.status}
                                                    </span>
                                                    {(inscricao.corGrupo || inscricao.grupoFuncional) && (
                                                        <span className={styles.badge} style={{ backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)', border: '1px solid var(--color-primary-200)' }}>
                                                            {inscricao.corGrupo || inscricao.grupoFuncional}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3>{inscricao.nomeCompleto}</h3>
                                                <p>{inscricao.apelido || 'Sem apelido'} • {inscricao.telefone || 'Sem contato'}</p>
                                            </div>

                                            <div className={styles.inscricaoActions}>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => navigate(`/admin/inscricoes/${inscricao.id}`)}
                                                >
                                                    Detalhes
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => navigate(inscricao.tipo === 'TRABALHADOR' ? `/admin/trabalhadores/editar/${inscricao.id}` : `/admin/inscricoes/editar/${inscricao.id}`)}
                                                >
                                                    Editar
                                                </Button>

                                                {inscricao.status === 'PENDENTE' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAprovar(inscricao.id, inscricao.tipo)}
                                                    >
                                                        Aprovar
                                                    </Button>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Inscricoes;
