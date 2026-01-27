import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import styles from './Configuracoes.module.css';

const Configuracoes = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);

        if (userData.role !== 'ADMIN') {
            toast.error('Acesso negado');
            navigate('/admin/dashboard');
            return;
        }

        carregar();
    }, []);

    const carregar = async () => {
        try {
            const { data } = await api.get('/config');
            setConfig(data);
        } catch (error) {
            toast.error('Erro ao carregar configurações');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/config', config);
            toast.success('Configurações salvas com sucesso!');
        } catch (error) {
            toast.error('Erro ao salvar configurações');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.blob} ${styles.blob1}`}></div>

            <motion.div
                className="fade-in"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.header}>
                    <h1 className={styles.title}>Ajustes do Sistema</h1>
                    <Button onClick={() => navigate('/admin/dashboard')} variant="ghost">
                        ← Dashboard
                    </Button>
                </div>

                <div className={styles.section}>
                    <Card>
                        <h2 className={styles.sectionTitle}>📊 Capacidade & Vagas</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <Input
                                label="Limites - Participantes"
                                type="number"
                                value={config?.limiteParticipantes || 0}
                                onChange={(e) => setConfig({ ...config, limiteParticipantes: parseInt(e.target.value) })}
                            />

                            <Input
                                label="Limites - Trabalhadores"
                                type="number"
                                value={config?.limiteTrabalhadores || 0}
                                onChange={(e) => setConfig({ ...config, limiteTrabalhadores: parseInt(e.target.value) })}
                            />
                        </div>
                    </Card>
                </div>

                <div className={styles.section}>
                    <Card>
                        <h2 className={styles.sectionTitle}>📅 Prazos e Datas</h2>
                        <Input
                            label="Data Final de Inscrição"
                            type="datetime-local"
                            value={config?.dataLimiteInscricoes ? new Date(config.dataLimiteInscricoes).toISOString().slice(0, 16) : ''}
                            onChange={(e) => setConfig({ ...config, dataLimiteInscricoes: e.target.value })}
                        />
                    </Card>
                </div>

                <div className={styles.actions}>
                    <Button
                        onClick={handleSave}
                        variant="primary"
                        disabled={saving}
                    >
                        {saving ? 'Publicando...' : 'Publicar Alterações'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default Configuracoes;
