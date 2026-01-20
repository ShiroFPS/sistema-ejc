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
            <div className={styles.content}>
                <div className={styles.logoContainer}>
                    <img src={logoEJC} alt="Logo EJC" className={styles.logo} />
                </div>

                <h1 className={styles.title}>
                    Bem-vindo ao Sistema de Inscrições
                </h1>

                <p className={styles.subtitle}>
                    Encontro de Jovens com Cristo - EJC
                </p>

                <p className={styles.description}>
                    Faça sua inscrição para participar deste momento especial de encontro,
                    renovação e fortalecimento da fé. Escolha abaixo como deseja participar:
                </p>

                <div className={styles.cardsGrid}>
                    <Card className={styles.optionCard}>
                        <div className={styles.cardIcon}>👤</div>
                        <h2 className={styles.cardTitle}>Participante</h2>
                        <p className={styles.cardDescription}>
                            Venha viver uma experiência única de encontro com Cristo e renovação espiritual.
                        </p>
                        <Button
                            fullWidth
                            size="lg"
                            onClick={() => navigate('/inscricao/participante')}
                        >
                            Inscrever como Participante
                        </Button>
                    </Card>

                    <Card className={styles.optionCard}>
                        <div className={styles.cardIcon}>✨</div>
                        <h2 className={styles.cardTitle}>Trabalhador</h2>
                        <p className={styles.cardDescription}>
                            Faça parte da equipe que torna este encontro possível, servindo com amor e dedicação.
                        </p>
                        <Button
                            fullWidth
                            size="lg"
                            onClick={() => navigate('/inscricao/trabalhador')}
                        >
                            Inscrever como Trabalhador
                        </Button>
                    </Card>
                </div>

                <div className={styles.adminLink}>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/login')}
                    >
                        Acesso Administrativo
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;
