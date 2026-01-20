import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Cracha from '../../components/Cracha';
import styles from './EditarTrabalhador.module.css';

const FUNCOES = [
    'Equipe dirigente',
    'Coordenação Geral',
    'Boa Vontade',
    'Banda',
    'Apresentadores',
    'Sociodrama',
    'Som & Iluminação',
    'Liturgia & Vigília',
    'Externa',
    'Secretaria',
    'Círculos',
    'Tráfego, Correios e Compras',
    'Lanchinho',
    'Cozinha',
    'Minibox',
    'Ordem',
    'Trânsito & Recepção',
];

const EditarTrabalhador = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trabalhador, setTrabalhador] = useState(null);
    const [cor, setCor] = useState('');
    const [funcao, setFuncao] = useState('');
    const [apelido, setApelido] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchTrabalhador = async () => {
            try {
                const response = await api.get(`/inscricoes/${id}?tipo=trabalhador`);
                setTrabalhador(response.data);
                setCor(response.data.corCracha || '');
                setFuncao(response.data.funcaoTrabalhador || '');
                setApelido(response.data.apelido || response.data.nomeCompleto1?.split(' ')[0] || '');
            } catch (error) {
                console.error('Erro ao buscar trabalhador:', error);
                toast.error('Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        fetchTrabalhador();
    }, [id]);

    const handleSalvar = async () => {
        setSaving(true);
        try {
            const payload = {
                corCracha: cor,
                funcaoTrabalhador: funcao,
                apelido: apelido
            };

            await api.put(`/cracha/${id}/atualizar`, payload);

            // Atualiza o estado local para refletir no preview imediatamente
            setTrabalhador(prev => ({
                ...prev,
                corCracha: cor,
                funcaoTrabalhador: funcao,
                apelido: apelido
            }));

            toast.success('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao salvar configurações');
        } finally {
            setSaving(false);
        }
    };

    const handleImprimirCracha = async () => {
        try {
            const response = await api.get(`/cracha/gerar/${id}?tipo=trabalhador`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `cracha_${trabalhador?.codigoVerificacao || 'print'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Crachá gerado!');
        } catch (error) {
            toast.error('Erro ao gerar crachá');
        }
    };

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (!trabalhador) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button onClick={() => navigate('/admin/inscricoes')} variant="ghost">
                    ← Voltar
                </Button>
                <Button onClick={handleImprimirCracha} variant="secondary">
                    🖨️ Imprimir Crachá
                </Button>
            </div>

            <h1 className={styles.title}>Editar Trabalhador</h1>

            <div className={styles.content}>
                <Card>
                    <h2 className={styles.sectionTitle}>👤 Informações Básicas</h2>
                    <p><strong>Nome:</strong> {trabalhador.nomeCompleto1}</p>
                    <p><strong>Email:</strong> {trabalhador.email}</p>
                    <p><strong>Contato:</strong> {trabalhador.contato1}</p>
                    <p><strong>Nome:</strong> {trabalhador.nomeCompleto1}</p>
                    <p><strong>Email:</strong> {trabalhador.email}</p>
                    <p><strong>Contato:</strong> {trabalhador.contato1}</p>
                    <p><strong>Código:</strong> <code>{trabalhador.codigoVerificacao}</code></p>
                </Card>

                <Card>
                    <h2 className={styles.sectionTitle}>🎨 Cor e Função</h2>

                    <div className={styles.controls}>
                        <h3>Configuração do Crachá</h3>

                        <div className={styles.formGroup}>
                            <label>Apelido (Nome no Crachá)</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={apelido}
                                onChange={(e) => setApelido(e.target.value)}
                                placeholder="Ex: João"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Cor do Crachá *</label>
                            <select
                                value={cor}
                                onChange={(e) => setCor(e.target.value)}
                                className={styles.select}
                            >
                                <option value="">Selecione uma cor</option>
                                <option value="VERDE">🟢 Verde</option>
                                <option value="AMARELO">🟡 Amarelo</option>
                                <option value="VERMELHO">🔴 Vermelho</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Função *</label>
                            <select
                                value={funcao}
                                onChange={(e) => setFuncao(e.target.value)}
                                className={styles.select}
                            >
                                <option value="">Selecione uma função</option>
                                {FUNCOES.map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>

                        <Button onClick={handleSalvar} disabled={saving} fullWidth>
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </Card>

                <Card>
                    <h2 className={styles.sectionTitle}>🎫 Preview do Crachá</h2>
                    <div className={styles.crachaPreview}>
                        <div>
                            <h3>Frente</h3>
                            <Cracha
                                inscricao={{ ...trabalhador, corCracha: cor, funcaoTrabalhador: funcao, apelido: apelido }}
                                tipo="trabalhador"
                                lado="frente"
                            />
                        </div>
                        <div>
                            <h3>Verso</h3>
                            <Cracha
                                inscricao={trabalhador}
                                tipo="trabalhador"
                                lado="verso"
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default EditarTrabalhador;
