import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import logoEJC from '../assets/logo-ejc.jpg'; // Assuming logo is available
import styles from './Home.module.css'; // Reusing Home styles for consistency

const VagasEsgotadas = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>

            <div className={`${styles.content} fade-in`}>
                <div className={styles.logoContainer}>
                    <img src={logoEJC} alt="Logo EJC" className={styles.logo} />
                </div>

                <Card className={styles.optionCard} style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
                    <h1 className={styles.title} style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        Inscrições Encerradas
                    </h1>

                    <p className={styles.description}>
                        Agradecemos o interesse! Todas as vagas para o XXIX EJC Auxiliadora já foram preenchidas.
                    </p>

                    <p className={styles.subtitle} style={{ fontSize: '1rem', marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
                        Fique atento às nossas redes sociais para mais informações sobre lista de espera ou próximos eventos.
                    </p>

                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Button variant="ghost" onClick={() => window.open('https://instagram.com/ejcauxiliadora', '_blank')}>
                            Acompanhar no Instagram
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/login')}>
                            Área Administrativa
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default VagasEsgotadas;
