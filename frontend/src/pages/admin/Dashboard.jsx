import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);

        api.get('/inscricoes/estatisticas').then(({ data }) => setStats(data));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dashboard Administrativo</h1>
                    <p className={styles.subtitle}>Bem-vindo, {user?.nome || 'Admin'}</p>
                </div>
                <Button onClick={handleLogout} variant="ghost">
                    Sair
                </Button>
            </div>

            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>👥</div>
                    <div className={styles.statInfo}>
                        <h3>Participantes</h3>
                        <p className={styles.statNumber}>{stats?.totalParticipantes || 0}</p>
                        <small>{stats?.vagasRestantesParticipantes || 0} vagas restantes</small>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>✨</div>
                    <div className={styles.statInfo}>
                        <h3>Trabalhadores</h3>
                        <p className={styles.statNumber}>{stats?.totalTrabalhadores || 0}</p>
                        <small>{stats?.vagasRestantesTrabalhadores || 0} vagas restantes</small>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>⏳</div>
                    <div className={styles.statInfo}>
                        <h3>Pendentes</h3>
                        <p className={styles.statNumber}>{stats?.pendentes || 0}</p>
                        <small>Aguardando aprovação</small>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>✅</div>
                    <div className={styles.statInfo}>
                        <h3>Aprovadas</h3>
                        <p className={styles.statNumber}>{stats?.aprovadas || 0}</p>
                        <small>Inscrições confirmadas</small>
                    </div>
                </Card>
            </div>

            <div className={styles.actions}>
                <Card className={styles.actionCard} onClick={() => navigate('/admin/inscricoes')}>
                    <h3>📋 Gerenciar Inscrições</h3>
                    <p>Visualizar, editar, aprovar e rejeitar inscrições</p>
                </Card>

                {user?.role === 'ADMIN' && (
                    <Card className={styles.actionCard} onClick={() => navigate('/admin/configuracoes')}>
                        <h3>⚙️ Configurações</h3>
                        <p>Gerenciar limites, datas e personalizações</p>
                    </Card>
                )}

                <Card className={styles.actionCard} onClick={() => navigate('/admin/trabalhadores/funcoes')}>
                    <h3>👥 Trabalhadores por Função</h3>
                    <p>Visualizar agrupamento das equipes</p>
                </Card>

                <Card className={styles.actionCard} onClick={() => navigate('/')}>
                    <h3>🏠 Ir para Home</h3>
                    <p>Voltar para página inicial pública</p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
