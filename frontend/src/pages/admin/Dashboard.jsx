import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Skeleton from '../../components/Skeleton';
import styles from './Dashboard.module.css';

const fetcher = url => api.get(url).then(res => res.data);

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const { data: stats, error, isLoading } = useSWR('/inscricoes/estatisticas', fetcher, {
        refreshInterval: 30000, // Atualiza a cada 30 segundos
        revalidateOnFocus: true
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (error) return <div className={styles.container}>Erro ao carregar dados.</div>;

    return (
        <div className={styles.container}>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>

            <div className="fade-in">
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Dashboard Administrativo</h1>
                        <p className={styles.subtitle}>Bem-vindo, {user?.nome || 'Admin'}</p>
                    </div>
                    <Button onClick={handleLogout} variant="ghost">
                        Sair
                    </Button>
                </div>

                <h2 className={styles.sectionTitle}>
                    <span>📊 Estatísticas</span>
                </h2>
                <div className={styles.statsGrid}>
                    <Card className={styles.statCard}>
                        <div className={styles.statInfo}>
                            <h3>Encontristas</h3>
                            {isLoading ? (
                                <Skeleton height="2rem" width="60%" />
                            ) : (
                                <p className={styles.statNumber}>{stats?.totalParticipantes || 0}</p>
                            )}
                            <small>
                                {isLoading ? <Skeleton height="1rem" width="80%" /> : `${stats?.vagasRestantesParticipantes || 0} vagas restantes`}
                            </small>
                        </div>
                        <div className={styles.statIcon}>👥</div>
                    </Card>

                    <Card className={styles.statCard}>
                        <div className={styles.statInfo}>
                            <h3>Encontreiros</h3>
                            {isLoading ? (
                                <Skeleton height="2rem" width="60%" />
                            ) : (
                                <p className={styles.statNumber}>{stats?.totalTrabalhadores || 0}</p>
                            )}
                            <small>
                                {isLoading ? <Skeleton height="1rem" width="80%" /> : `${stats?.vagasRestantesTrabalhadores || 0} vagas restantes`}
                            </small>
                        </div>
                        <div className={styles.statIcon}>✨</div>
                    </Card>

                    <Card className={styles.statCard}>
                        <div className={styles.statInfo}>
                            <h3>Pendentes</h3>
                            {isLoading ? (
                                <Skeleton height="2rem" width="60%" />
                            ) : (
                                <p className={styles.statNumber}>{stats?.pendentes || 0}</p>
                            )}
                            <small>Aguardando aprovação</small>
                        </div>
                        <div className={styles.statIcon}>⏳</div>
                    </Card>

                    <Card className={styles.statCard}>
                        <div className={styles.statInfo}>
                            <h3>Aprovadas</h3>
                            {isLoading ? (
                                <Skeleton height="2rem" width="60%" />
                            ) : (
                                <p className={styles.statNumber}>{stats?.aprovadas || 0}</p>
                            )}
                            <small>Inscrições confirmadas</small>
                        </div>
                        <div className={styles.statIcon}>✅</div>
                    </Card>
                </div>

                <h2 className={styles.sectionTitle}>
                    <span>🚀 Ações Rápidas</span>
                </h2>
                <div className={styles.actions}>
                    <Card className={styles.actionCard} onClick={() => navigate('/admin/inscricoes')}>
                        <h3>📋 Inscrições</h3>
                        <p>Gerencie todos os encontristas e encontreiros em um só lugar.</p>
                    </Card>

                    {user?.role === 'ADMIN' && (
                        <Card className={styles.actionCard} onClick={() => navigate('/admin/configuracoes')}>
                            <h3>⚙️ Configurações</h3>
                            <p>Ajuste limites de vagas, prazos e preferências do sistema.</p>
                        </Card>
                    )}

                    <Card className={styles.actionCard} onClick={() => navigate('/admin/trabalhadores/funcoes')}>
                        <h3>🗺️ Equipes</h3>
                        <p>Distribuição de encontreiros por função e grupo funcional.</p>
                    </Card>

                    <Card className={styles.actionCard} onClick={() => navigate('/')}>
                        <h3>🏠 Portal Público</h3>
                        <p>Visualizar a página inicial de inscrições.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
