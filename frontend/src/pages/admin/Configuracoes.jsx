import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
        return <div className={styles.loading}>Carregando...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Configurações do Sistema</h1>
                <Button onClick={() => navigate('/admin/dashboard')} variant="ghost">
                    ← Voltar
                </Button>
            </div>

            <Card>
                <h2 className={styles.sectionTitle}>📊 Limites de Vagas</h2>

                <Input
                    label="Limite de Vagas - Participantes"
                    type="number"
                    value={config?.limiteParticipantes || 0}
                    onChange={(e) => setConfig({ ...config, limiteParticipantes: parseInt(e.target.value) })}
                />

                <Input
                    label="Limite de Vagas - Trabalhadores"
                    type="number"
                    value={config?.limiteTrabalhadores || 0}
                    onChange={(e) => setConfig({ ...config, limiteTrabalhadores: parseInt(e.target.value) })}
                />
            </Card>

            <Card>
                <h2 className={styles.sectionTitle}>📅 Data Limite</h2>

                <Input
                    label="Data Limite para Inscrições"
                    type="datetime-local"
                    value={config?.dataLimiteInscricoes ? new Date(config.dataLimiteInscricoes).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setConfig({ ...config, dataLimiteInscricoes: e.target.value })}
                />
            </Card>

            <div className={styles.actions}>
                <Button
                    onClick={handleSave}
                    size="lg"
                    disabled={saving}
                >
                    {saving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
            </div>
        </div>
    );
};

export default Configuracoes;
