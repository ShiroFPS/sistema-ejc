import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import logoEJC from '../assets/logo-ejc.jpg';
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', senha: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success(`Bem-vindo, ${data.user.nome}!`);
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.loginCard}>
                <div className={styles.logoContainer}>
                    <img src={logoEJC} alt="Logo EJC" className={styles.logo} />
                </div>

                <h1 className={styles.title}>Área Administrativa</h1>
                <p className={styles.subtitle}>Sistema de Inscrições EJC</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                    />

                    <Input
                        label="Senha"
                        type="password"
                        required
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        placeholder="••••••••"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>

                <div className={styles.backLink}>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                    >
                        ← Voltar para Home
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Login;
