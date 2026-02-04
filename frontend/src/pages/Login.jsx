import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
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
            console.log('Tentando login com:', formData.email);
            console.log('API URL:', import.meta.env.VITE_API_URL);

            const { data } = await api.post('/auth/login', formData);
            console.log('Login bem sucedido:', data);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success(`Bem-vindo, ${data.user.nome}!`);
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Erro detalhado login:', error);
            console.error('Erro response:', error.response);
            console.error('Erro request:', error.request);
            console.error('Erro config:', error.config);

            const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.blob}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.loginCard}
            >
                <Card>
                    <div className={styles.logoContainer}>
                        <img src={logoEJC} alt="Logo EJC" className={styles.logo} />
                    </div>

                    <h1 className={styles.title}>Área Administrativa</h1>
                    <p className={styles.subtitle}>Acesse o painel de comando</p>

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
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? 'Validando...' : 'Entrar no Sistema'}
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
            </motion.div>
        </div>
    );
};

export default Login;
