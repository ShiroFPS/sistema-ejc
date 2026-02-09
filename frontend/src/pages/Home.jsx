import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import logoEJC from '../assets/logo-ejc.jpg';
import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/config')
            .then(({ data }) => {
                setConfig(data);
                // Se ambas as vagas estiverem zeradas, redirecionar globalmente
                const vagasPart = data.limiteParticipantes - (data.totalParticipantes || 0);
                const vagasTrab = data.limiteTrabalhadores - (data.totalTrabalhadores || 0);

                if (vagasPart <= 0 && vagasTrab <= 0) {
                    navigate('/vagas-esgotadas');
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) return null; // ou um spinner

    const vagasParticipante = config ? config.limiteParticipantes - (config.totalParticipantes || 0) : 0;
    const vagasTrabalhador = config ? config.limiteTrabalhadores - (config.totalTrabalhadores || 0) : 0;

    return (
        <div className={styles.container}>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>

            <div className={`${styles.content} fade-in`}>
                <div className={styles.logoContainer}>
                    <img src={logoEJC} alt="Logo EJC" className={styles.logo} />
                </div>

                <h1 className={styles.title}>
                    Sistema de Inscrições
                </h1>

                <p className={styles.subtitle}>
                    XXIX EJC AUXILIADORA
                </p>

                <p className={styles.description}>
                    Prepare-se para uma experiência única de encontro com Cristo. Escolha sua modalidade abaixo e inicie sua jornada.
                </p>

                <div className={styles.cardsGrid}>
                    <Card className={styles.optionCard}>
                        <div className={styles.cardIcon}>👤</div>
                        <h2 className={styles.cardTitle}>Encontrista</h2>
                        <p className={styles.cardDescription}>
                            Para jovens que desejam vivenciar o encontro pela primeira vez.
                        </p>
                        {vagasParticipante > 0 ? (
                            <Button
                                fullWidth
                                variant="primary"
                                onClick={() => navigate('/inscricao/participante')}
                            >
                                Fazer Inscrição
                            </Button>
                        ) : (
                            <Button fullWidth variant="danger" disabled>
                                Vagas Esgotadas
                            </Button>
                        )}
                    </Card>

                    <Card className={styles.optionCard}>
                        <div className={styles.cardIcon}>🤝</div>
                        <h2 className={styles.cardTitle}>Encontreiro</h2>
                        <p className={styles.cardDescription}>
                            Para quem já fez o EJC e deseja servir nas diversas equipes.
                        </p>
                        {vagasTrabalhador > 0 ? (
                            <Button
                                fullWidth
                                variant="primary"
                                onClick={() => navigate('/inscricao/trabalhador')}
                            >
                                Fazer Inscrição
                            </Button>
                        ) : (
                            <Button fullWidth variant="danger" disabled>
                                Vagas Esgotadas
                            </Button>
                        )}
                    </Card>
                </div>

                <div className={styles.adminLink}>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/login')}
                    >
                        Painel Administrativo
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;
