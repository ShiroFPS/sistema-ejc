import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import logoEJC from '../assets/logo-ejc.jpg';
import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate();

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
                        <h2 className={styles.cardTitle}>Participante</h2>
                        <p className={styles.cardDescription}>
                            Para jovens que desejam vivenciar o encontro pela primeira vez.
                        </p>
                        <Button
                            fullWidth
                            variant="primary"
                            onClick={() => navigate('/inscricao/participante')}
                        >
                            Fazer Inscrição
                        </Button>
                    </Card>

                    <Card className={styles.optionCard}>
                        <div className={styles.cardIcon}>🤝</div>
                        <h2 className={styles.cardTitle}>Trabalhador</h2>
                        <p className={styles.cardDescription}>
                            Para encontristas que desejam servir nas diversas equipes do encontro.
                        </p>
                        <Button
                            fullWidth
                            variant="primary"
                            onClick={() => navigate('/inscricao/trabalhador')}
                        >
                            Fazer Inscrição
                        </Button>
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
